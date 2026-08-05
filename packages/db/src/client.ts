import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export type Database = ReturnType<typeof createDb>;

export function createSql(connectionString: string) {
  return postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export function createDb(connectionString: string) {
  const sql = createSql(connectionString);
  const db = drizzle(sql, { schema });
  return { db, sql };
}

export async function pingPostgres(connectionString: string): Promise<number> {
  const started = Date.now();
  const sql = createSql(connectionString);
  try {
    await sql`select 1`;
    return Date.now() - started;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
