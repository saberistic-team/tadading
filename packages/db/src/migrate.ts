import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSql } from "./client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getMigrationsFolder(): string {
  return path.join(__dirname, "..", "drizzle");
}

export async function runMigrations(connectionString: string): Promise<string> {
  const migrationsFolder = getMigrationsFolder();
  const sql = createSql(connectionString);
  try {
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder });
    return migrationsFolder;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
