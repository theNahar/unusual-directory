-- Migration: Add users, analytics, and favorites tables
-- Created: 2025-01-XX

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" integer NOT NULL DEFAULT 0,
	"verification_token" text,
	"verification_expires" integer,
	"password_hash" text,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	"updated_at" integer NOT NULL DEFAULT (unixepoch()),
	"last_sign_in" integer
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS "user_favorites" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"user_id" text NOT NULL,
	"bookmark_id" integer NOT NULL,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY ("bookmark_id") REFERENCES "bookmarks"("id") ON DELETE CASCADE
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS "analytics" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"type" text NOT NULL,
	"bookmark_id" integer,
	"user_id" text,
	"session_id" text,
	"user_agent" text,
	"ip_address" text,
	"referrer" text,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY ("bookmark_id") REFERENCES "bookmarks"("id") ON DELETE CASCADE,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Add new columns to bookmarks table
ALTER TABLE "bookmarks" ADD COLUMN "is_promoted" integer NOT NULL DEFAULT 0;
ALTER TABLE "bookmarks" ADD COLUMN "promotion_expires" integer;
ALTER TABLE "bookmarks" ADD COLUMN "visit_count" integer NOT NULL DEFAULT 0;
ALTER TABLE "bookmarks" ADD COLUMN "favorite_count" integer NOT NULL DEFAULT 0;

-- Remove old columns from bookmarks table
ALTER TABLE "bookmarks" DROP COLUMN "screenshot";
ALTER TABLE "bookmarks" DROP COLUMN "og_title";
ALTER TABLE "bookmarks" DROP COLUMN "og_description";
ALTER TABLE "bookmarks" DROP COLUMN "last_visited";
ALTER TABLE "bookmarks" DROP COLUMN "notes";
ALTER TABLE "bookmarks" DROP COLUMN "is_favorite";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "user_favorites_user_id_idx" ON "user_favorites" ("user_id");
CREATE INDEX IF NOT EXISTS "user_favorites_bookmark_id_idx" ON "user_favorites" ("bookmark_id");
CREATE INDEX IF NOT EXISTS "analytics_type_idx" ON "analytics" ("type");
CREATE INDEX IF NOT EXISTS "analytics_bookmark_id_idx" ON "analytics" ("bookmark_id");
CREATE INDEX IF NOT EXISTS "analytics_user_id_idx" ON "analytics" ("user_id");
CREATE INDEX IF NOT EXISTS "analytics_created_at_idx" ON "analytics" ("created_at");
