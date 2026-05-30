CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"language" text DEFAULT 'bg' NOT NULL,
	"measurement_system" text DEFAULT 'metric' NOT NULL,
	"notifications_enabled" text DEFAULT 'true' NOT NULL,
	"email_notifications_enabled" text DEFAULT 'true' NOT NULL,
	"weekly_summary_enabled" text DEFAULT 'true' NOT NULL,
	"privacy_profile_visible" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;