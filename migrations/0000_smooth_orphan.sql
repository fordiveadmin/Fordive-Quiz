CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"data" text NOT NULL,
	"mime_type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"type" text NOT NULL,
	"order" integer NOT NULL,
	"layout" text DEFAULT 'standard',
	"is_main_question" boolean DEFAULT false,
	"parent_id" integer,
	"parent_option_id" text,
	"options" json
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"primary_scent_id" integer NOT NULL,
	"zodiac_sign" text,
	"answers" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"notes" text[],
	"vibes" text[],
	"mood" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"image_url" text,
	"image_id" integer,
	"purchase_url" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subscribe_to_newsletter" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "zodiac_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"zodiac_sign" text NOT NULL,
	"scent_id" integer NOT NULL,
	"description" text NOT NULL
);
