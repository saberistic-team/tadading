import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Phase 0 baseline table — product tables arrive in later phases. */
export const schemaMeta = pgTable("schema_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
