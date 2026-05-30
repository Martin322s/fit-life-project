-- Clear stale base64 data URLs that are no longer valid after migrating to R2.
UPDATE "users" SET "avatar_data_url" = NULL WHERE "avatar_data_url" LIKE 'data:image/%';
--> statement-breakpoint
-- Rename column to reflect that it now stores an object-storage URL, not a data URI.
ALTER TABLE "users" RENAME COLUMN "avatar_data_url" TO "avatar_url";
