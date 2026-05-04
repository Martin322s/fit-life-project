DROP TABLE IF EXISTS "products";
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"brand" text,
	"serving_size" real NOT NULL,
	"serving_unit" text NOT NULL,
	"calories" integer NOT NULL,
	"protein" real NOT NULL,
	"carbs" real NOT NULL,
	"fat" real NOT NULL,
	"sugar" real,
	"fiber" real,
	"salt" real,
	"barcode" text,
	"image_url" text,
	"tags" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
