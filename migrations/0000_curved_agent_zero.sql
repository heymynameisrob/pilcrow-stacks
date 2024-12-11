-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "pilcrowstacks_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"image" text,
	CONSTRAINT "pilcrowstacks_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pilcrowstacks_docs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"emoji" text,
	"content" jsonb,
	"last_edited" timestamp DEFAULT now() NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pilcrowstacks_docs_in_view" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"doc_ids" jsonb NOT NULL,
	"cursor" text DEFAULT '0' NOT NULL,
	"homepage" text,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pilcrowstacks_backlinks" (
	"user_id" text NOT NULL,
	"source_id" text NOT NULL,
	"target_id" text NOT NULL,
	CONSTRAINT "pilcrowstacks_backlinks_source_id_target_id_pk" PRIMARY KEY("source_id","target_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_docs" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."pilcrowstacks_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_docs_in_view" ADD CONSTRAINT "pilcrowstacks_docs_in_view_user_id_pilcrowstacks_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pilcrowstacks_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_docs_in_view" ADD CONSTRAINT "pilcrowstacks_docs_in_view_homepage_pilcrowstacks_docs_id_fk" FOREIGN KEY ("homepage") REFERENCES "public"."pilcrowstacks_docs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_backlinks" ADD CONSTRAINT "pilcrowstacks_backlinks_user_id_pilcrowstacks_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pilcrowstacks_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_backlinks" ADD CONSTRAINT "pilcrowstacks_backlinks_source_id_pilcrowstacks_docs_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."pilcrowstacks_docs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pilcrowstacks_backlinks" ADD CONSTRAINT "pilcrowstacks_backlinks_target_id_pilcrowstacks_docs_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."pilcrowstacks_docs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/