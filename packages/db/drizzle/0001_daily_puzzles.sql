DO $$ BEGIN
 CREATE TYPE "public"."puzzle_status" AS ENUM('draft', 'scheduled', 'published', 'retired', 'fallback');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."puzzle_difficulty" AS ENUM('easy', 'standard', 'tricky');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "daily_puzzles" (
  "id" text PRIMARY KEY NOT NULL,
  "publication_day" text NOT NULL,
  "generator_version" text NOT NULL,
  "difficulty" "puzzle_difficulty" NOT NULL,
  "seed_hash" text NOT NULL,
  "public_tiles" jsonb NOT NULL,
  "canonical_solution_hash" text NOT NULL,
  "initial_order" jsonb NOT NULL,
  "difficulty_score" integer NOT NULL,
  "status" "puzzle_status" NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "daily_puzzles_publication_day_uidx" ON "daily_puzzles" ("publication_day");
