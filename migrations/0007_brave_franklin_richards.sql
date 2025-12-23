CREATE TABLE "contact_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_name" varchar DEFAULT 'Guest',
	"email" varchar,
	"phone_number" varchar,
	"purpose" text,
	"summary" text,
	"raw_transcript" jsonb NOT NULL,
	"is_reviewed" boolean DEFAULT false,
	"action_taken" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
