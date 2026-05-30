-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0013 — Catalog performance indexes
--
-- B-tree indexes are safe on any PostgreSQL instance.
-- GIN / trgm indexes require the pg_trgm extension (enabled by default on Neon).
-- If you run a self-hosted PostgreSQL, execute the following once first:
--   CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── recipes ─────────────────────────────────────────────────────────────────
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_category_difficulty_idx" ON "recipes" ("category", "difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_created_at_idx" ON "recipes" ("created_at" DESC);

-- ─── training_plans ──────────────────────────────────────────────────────────
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_plans_goal_type_level_idx" ON "training_plans" ("goal_type", "level");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_plans_level_idx" ON "training_plans" ("level");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_plans_created_at_idx" ON "training_plans" ("created_at" DESC);

-- ─── products ────────────────────────────────────────────────────────────────
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_created_at_idx" ON "products" ("category", "created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_protein_idx" ON "products" ("category", "protein" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" ("created_at" DESC);

-- ─── Full-text / trgm GIN indexes (require pg_trgm extension) ────────────────
-- These are safe to run even if the indexes already exist (IF NOT EXISTS guard).
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_title_trgm_idx" ON "recipes" USING gin ("title" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_description_trgm_idx" ON "recipes" USING gin ("description" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_name_trgm_idx" ON "products" USING gin ("name" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_description_trgm_idx" ON "products" USING gin ("description" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_brand_trgm_idx" ON "products" USING gin ("brand" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_plans_title_trgm_idx" ON "training_plans" USING gin ("title" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_plans_description_trgm_idx" ON "training_plans" USING gin ("description" gin_trgm_ops);
