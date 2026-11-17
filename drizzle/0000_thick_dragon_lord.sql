CREATE TABLE "ai_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"lesson_id" integer NOT NULL,
	"markdown" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"kind" text NOT NULL,
	"score" integer NOT NULL,
	"passed" boolean NOT NULL,
	"detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"level" text NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" text,
	"transcript" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scores" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"version" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"content" jsonb,
	"model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_notes" (
	"topic_id" text PRIMARY KEY NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"bookmarked" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"unit_id" text PRIMARY KEY NOT NULL,
	"section" text,
	"percent" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"due_date" date NOT NULL,
	"round" integer DEFAULT 1 NOT NULL,
	"done_at" timestamp with time zone,
	"passed" boolean
);
--> statement-breakpoint
CREATE TABLE "schedule_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"planned_for" date NOT NULL,
	"reason" text NOT NULL,
	"summary" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_items" (
	"unit_id" text PRIMARY KEY NOT NULL,
	"date" date,
	"slot" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_code" text NOT NULL,
	"unit_id" text NOT NULL,
	"name" text NOT NULL,
	"subtopics" jsonb NOT NULL,
	"kind" text NOT NULL,
	"position" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"importance" integer NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"mastery_score" integer DEFAULT 0 NOT NULL,
	"target_date" date,
	"revision_date" date,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "unit_prereqs" (
	"unit_id" text NOT NULL,
	"prereq_id" text NOT NULL,
	CONSTRAINT "unit_prereqs_unit_id_prereq_id_pk" PRIMARY KEY("unit_id","prereq_id")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_code" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"importance" integer NOT NULL,
	"estimated_minutes" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_notes" ADD CONSTRAINT "ai_notes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_notes" ADD CONSTRAINT "ai_notes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_notes" ADD CONSTRAINT "personal_notes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_items" ADD CONSTRAINT "schedule_items_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_code_subjects_code_fk" FOREIGN KEY ("subject_code") REFERENCES "public"."subjects"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_prereqs" ADD CONSTRAINT "unit_prereqs_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_prereqs" ADD CONSTRAINT "unit_prereqs_prereq_id_units_id_fk" FOREIGN KEY ("prereq_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_subject_code_subjects_code_fk" FOREIGN KEY ("subject_code") REFERENCES "public"."subjects"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_notes_topic_idx" ON "ai_notes" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "attempts_topic_idx" ON "attempts" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "iq_topic_idx" ON "interview_questions" USING btree ("topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_unit_version_idx" ON "lessons" USING btree ("unit_id","version");--> statement-breakpoint
CREATE INDEX "revisions_due_idx" ON "revisions" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "schedule_date_idx" ON "schedule_items" USING btree ("date");--> statement-breakpoint
CREATE INDEX "topics_unit_idx" ON "topics" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "topics_subject_idx" ON "topics" USING btree ("subject_code");