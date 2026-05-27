CREATE TABLE "training_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"goal_type" text NOT NULL,
	"level" text NOT NULL,
	"duration_weeks" integer NOT NULL,
	"sessions_per_week" integer NOT NULL,
	"average_session_minutes" integer NOT NULL,
	"equipment" jsonb NOT NULL,
	"target_muscles" jsonb NOT NULL,
	"calories_burn_estimate" integer,
	"plan_structure" jsonb NOT NULL,
	"weekly_schedule" jsonb NOT NULL,
	"safety_notes" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
