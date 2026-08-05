import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
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
