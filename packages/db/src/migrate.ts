import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSql } from "./client.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://tadading:tadading@localhost:5433/tadading";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, "..", "drizzle");

async function main(): Promise<void> {
  const sql = createSql(connectionString);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder });
  await sql.end({ timeout: 5 });
  console.log(JSON.stringify({ message: "migrations_applied", migrationsFolder }));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
