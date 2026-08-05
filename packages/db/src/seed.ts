import { eq } from "drizzle-orm";
import { createEntityId } from "@tadading/domain";
import {
  generatePuzzle,
  getFallbackPuzzle,
  hmacDailySeed,
  serializePublicPuzzle,
} from "@tadading/puzzle-engine";
import { createDb } from "./client.js";
import { dailyPuzzles, schemaMeta } from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://tadading:tadading@localhost:5433/tadading";

const puzzleSeedSecret =
  process.env.PUZZLE_SEED_SECRET ?? "dev-puzzle-seed-secret-change-me";

function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  const { db, sql } = createDb(connectionString);

  await db
    .insert(schemaMeta)
    .values({ key: "phase", value: "2" })
    .onConflictDoUpdate({
      target: schemaMeta.key,
      set: { value: "2", updatedAt: new Date() },
    });

  const fallback = getFallbackPuzzle();
  const fallbackDay = "1970-01-01";
  const existingFallback = await db
    .select()
    .from(dailyPuzzles)
    .where(eq(dailyPuzzles.publicationDay, fallbackDay))
    .limit(1);

  if (existingFallback.length === 0) {
    const id = createEntityId();
    const pub = serializePublicPuzzle(fallback, {
      id,
      publicationDay: fallbackDay,
    });
    await db.insert(dailyPuzzles).values({
      id,
      publicationDay: fallbackDay,
      generatorVersion: fallback.generatorVersion,
      difficulty: fallback.difficulty,
      seedHash: fallback.seed,
      publicTiles: pub.tiles,
      canonicalSolutionHash: fallback.canonicalSolutionHash,
      initialOrder: pub.initialOrder,
      difficultyScore: fallback.difficultyScore,
      status: "fallback",
      publishedAt: new Date(),
    });
  }

  const today = utcDay();
  const existingToday = await db
    .select()
    .from(dailyPuzzles)
    .where(eq(dailyPuzzles.publicationDay, today))
    .limit(1);

  if (existingToday.length === 0) {
    const seed = hmacDailySeed(
      puzzleSeedSecret,
      today,
      "standard",
      fallback.generatorVersion,
    );
    const puzzle = generatePuzzle(seed, { difficulty: "standard" });
    const id = createEntityId();
    const pub = serializePublicPuzzle(puzzle, {
      id,
      publicationDay: today,
    });
    await db.insert(dailyPuzzles).values({
      id,
      publicationDay: today,
      generatorVersion: puzzle.generatorVersion,
      difficulty: puzzle.difficulty,
      seedHash: seed,
      publicTiles: pub.tiles,
      canonicalSolutionHash: puzzle.canonicalSolutionHash,
      initialOrder: pub.initialOrder,
      difficultyScore: puzzle.difficultyScore,
      status: "published",
      publishedAt: new Date(),
    });
  }

  await sql.end({ timeout: 5 });
  console.log(JSON.stringify({ message: "seed_complete", phase: "2", today }));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
