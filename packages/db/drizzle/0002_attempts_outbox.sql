CREATE TABLE IF NOT EXISTS "puzzle_attempts" (
  "id" text PRIMARY KEY NOT NULL,
  "puzzle_id" text NOT NULL REFERENCES "daily_puzzles"("id"),
  "user_id" text,
  "guest_id_hash" text,
  "client_attempt_id" text NOT NULL,
  "initial_order_hash" text NOT NULL,
  "current_order" jsonb,
  "started_at" timestamp with time zone NOT NULL,
  "last_saved_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "moves" integer DEFAULT 0 NOT NULL,
  "hint_count" integer DEFAULT 0 NOT NULL,
  "duration_ms" integer,
  "completion_order_hash" text,
  "client_version" text NOT NULL,
  "share_code" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "puzzle_attempts_client_attempt_id_uidx"
  ON "puzzle_attempts" ("client_attempt_id");

CREATE TABLE IF NOT EXISTS "guest_streaks" (
  "guest_id_hash" text PRIMARY KEY NOT NULL,
  "current_count" integer DEFAULT 0 NOT NULL,
  "longest_count" integer DEFAULT 0 NOT NULL,
  "last_completed_day" text,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "outbox_events" (
  "id" text PRIMARY KEY NOT NULL,
  "aggregate_type" text NOT NULL,
  "aggregate_id" text NOT NULL,
  "event_type" text NOT NULL,
  "event_version" integer NOT NULL,
  "payload" jsonb NOT NULL,
  "trace_id" text,
  "occurred_at" timestamp with time zone NOT NULL,
  "available_at" timestamp with time zone NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "dispatched_at" timestamp with time zone,
  "last_error" text
);

CREATE TABLE IF NOT EXISTS "inbox_events" (
  "consumer" text NOT NULL,
  "event_id" text NOT NULL,
  "processed_at" timestamp with time zone NOT NULL,
  PRIMARY KEY ("consumer", "event_id")
);
