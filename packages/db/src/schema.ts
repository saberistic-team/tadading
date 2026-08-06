import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Phase 0 baseline table. */
export const schemaMeta = pgTable("schema_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const puzzleStatusEnum = pgEnum("puzzle_status", [
  "draft",
  "scheduled",
  "published",
  "retired",
  "fallback",
]);

export const puzzleDifficultyEnum = pgEnum("puzzle_difficulty", [
  "easy",
  "standard",
  "tricky",
]);

export const dailyPuzzles = pgTable(
  "daily_puzzles",
  {
    id: text("id").primaryKey(),
    publicationDay: text("publication_day").notNull(),
    generatorVersion: text("generator_version").notNull(),
    difficulty: puzzleDifficultyEnum("difficulty").notNull(),
    seedHash: text("seed_hash").notNull(),
    publicTiles: jsonb("public_tiles").notNull(),
    canonicalSolutionHash: text("canonical_solution_hash").notNull(),
    initialOrder: jsonb("initial_order").notNull(),
    difficultyScore: integer("difficulty_score").notNull(),
    status: puzzleStatusEnum("status").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("daily_puzzles_publication_day_uidx").on(table.publicationDay),
  ],
);

export type DailyPuzzleRow = typeof dailyPuzzles.$inferSelect;

export const puzzleAttempts = pgTable(
  "puzzle_attempts",
  {
    id: text("id").primaryKey(),
    puzzleId: text("puzzle_id")
      .notNull()
      .references(() => dailyPuzzles.id),
    userId: text("user_id"),
    guestIdHash: text("guest_id_hash"),
    clientAttemptId: text("client_attempt_id").notNull(),
    initialOrderHash: text("initial_order_hash").notNull(),
    currentOrder: jsonb("current_order"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    lastSavedAt: timestamp("last_saved_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    moves: integer("moves").notNull().default(0),
    hintCount: integer("hint_count").notNull().default(0),
    durationMs: integer("duration_ms"),
    completionOrderHash: text("completion_order_hash"),
    clientVersion: text("client_version").notNull(),
    shareCode: text("share_code"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("puzzle_attempts_client_attempt_id_uidx").on(
      table.clientAttemptId,
    ),
  ],
);

export type PuzzleAttemptRow = typeof puzzleAttempts.$inferSelect;

/** Guest streak projection until passkey claim (Phase 3). */
export const guestStreaks = pgTable("guest_streaks", {
  guestIdHash: text("guest_id_hash").primaryKey(),
  currentCount: integer("current_count").notNull().default(0),
  longestCount: integer("longest_count").notNull().default(0),
  lastCompletedDay: text("last_completed_day"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const outboxEvents = pgTable("outbox_events", {
  id: text("id").primaryKey(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: text("aggregate_id").notNull(),
  eventType: text("event_type").notNull(),
  eventVersion: integer("event_version").notNull(),
  payload: jsonb("payload").notNull(),
  traceId: text("trace_id"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  availableAt: timestamp("available_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  lastError: text("last_error"),
});

export type OutboxEventRow = typeof outboxEvents.$inferSelect;

export const inboxEvents = pgTable(
  "inbox_events",
  {
    consumer: text("consumer").notNull(),
    eventId: text("event_id").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.consumer, table.eventId] })],
);
