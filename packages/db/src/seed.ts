import { eq } from "drizzle-orm";
import { createDb } from "./client.js";
import { schemaMeta } from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://tadading:tadading@localhost:5433/tadading";

async function main(): Promise<void> {
  const { db, sql } = createDb(connectionString);
  const existing = await db
    .select()
    .from(schemaMeta)
    .where(eq(schemaMeta.key, "phase"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schemaMeta).values({ key: "phase", value: "0" });
  }

  await sql.end({ timeout: 5 });
  console.log(JSON.stringify({ message: "seed_complete", phase: "0" }));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
