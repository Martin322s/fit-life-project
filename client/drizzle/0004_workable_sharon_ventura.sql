CREATE TABLE "diets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"goal_type" text NOT NULL,
	"duration_days" integer NOT NULL,
	"difficulty" text NOT NULL,
	"calories_per_day" integer NOT NULL,
	"protein_target" real NOT NULL,
	"carbs_target" real NOT NULL,
	"fat_target" real NOT NULL,
	"rules" jsonb NOT NULL,
	"sample_menu" jsonb NOT NULL,
	"suitable_for" jsonb NOT NULL,
	"not_suitable_for" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
