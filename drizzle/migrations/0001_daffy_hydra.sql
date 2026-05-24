CREATE TYPE "public"."event_type" AS ENUM('in_person', 'virtual');--> statement-breakpoint
CREATE TYPE "public"."town_hall_status" AS ENUM('idle', 'live', 'ended');--> statement-breakpoint
CREATE TABLE "town_halls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"livekit_room_name" text NOT NULL,
	"town_hall_status" "town_hall_status" DEFAULT 'idle' NOT NULL,
	"egress_id" text,
	"recording_r2_key" text,
	"transcript" text,
	"summary" text,
	"summary_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "town_halls_event_id_unique" UNIQUE("event_id"),
	CONSTRAINT "town_halls_livekit_room_name_unique" UNIQUE("livekit_room_name")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_type" "event_type" DEFAULT 'in_person' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country_of_birth" text;--> statement-breakpoint
ALTER TABLE "town_halls" ADD CONSTRAINT "town_halls_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;