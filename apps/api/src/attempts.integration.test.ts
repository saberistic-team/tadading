import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createEntityId } from "@tadading/domain";
import {
  createDb,
  dailyPuzzles,
  outboxEvents,
  puzzleAttempts,
  runMigrations,
} from "@tadading/db";
import {
  generatePuzzle,
  hmacDailySeed,
  serializePublicPuzzle,
} from "@tadading/puzzle-engine";
import { eq } from "drizzle-orm";
import { AttemptsService } from "./attempts.service.js";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://tadading:tadading@localhost:5433/tadading";

describe("attempts integration", () => {
  const service = new AttemptsService(databaseUrl);
  let puzzleId = "";
  let solutionOrder: string[] = [];

  beforeAll(async () => {
    await runMigrations(databaseUrl);
    const { db, sql } = createDb(databaseUrl);
    const day = "2099-01-01";
    const seed = hmacDailySeed("test-secret", day, "standard", "1");
    const puzzle = generatePuzzle(seed, { difficulty: "standard" });
    puzzleId = createEntityId();
    solutionOrder = [...puzzle.solutionOrder];
    const pub = serializePublicPuzzle(puzzle, {
      id: puzzleId,
      publicationDay: day,
    });
    await db
      .insert(dailyPuzzles)
      .values({
        id: puzzleId,
        publicationDay: day,
        generatorVersion: puzzle.generatorVersion,
        difficulty: puzzle.difficulty,
        seedHash: seed,
        publicTiles: pub.tiles,
        canonicalSolutionHash: puzzle.canonicalSolutionHash,
        initialOrder: pub.initialOrder,
        difficultyScore: puzzle.difficultyScore,
        status: "published",
        publishedAt: new Date(),
      })
      .onConflictDoNothing();
    await sql.end({ timeout: 5 });
  });

  afterAll(async () => {
    const { db, sql } = createDb(databaseUrl);
    await db.delete(puzzleAttempts).where(eq(puzzleAttempts.puzzleId, puzzleId));
    await db.delete(dailyPuzzles).where(eq(dailyPuzzles.id, puzzleId));
    await sql.end({ timeout: 5 });
  });

  it("starts, completes idempotently, and writes outbox events", async () => {
    const clientAttemptId = `client-${createEntityId()}`;
    const guestIdHash = `guest-${createEntityId()}`;
    const started = await service.start({
      puzzleId,
      guestIdHash,
      clientAttemptId,
      clientVersion: "test-1",
      initialOrder: solutionOrder,
    });
    expect(started.id).toBeTruthy();
    expect(started.traceId).toBeTruthy();

    const again = await service.start({
      puzzleId,
      guestIdHash,
      clientAttemptId,
      clientVersion: "test-1",
      initialOrder: solutionOrder,
    });
    expect(again.id).toBe(started.id);

    const first = await service.complete({
      attemptId: started.id,
      guestIdHash,
      order: solutionOrder,
      moves: 12,
      hintCount: 1,
      durationMs: 45_000,
    });
    expect(first.ok).toBe(true);
    expect(first.share?.code).toBeTruthy();
    expect(first.eventIds?.length).toBeGreaterThan(0);
    expect(first.streak?.currentCount).toBeGreaterThanOrEqual(1);

    const second = await service.complete({
      attemptId: started.id,
      guestIdHash,
      order: solutionOrder,
      moves: 99,
      hintCount: 9,
      durationMs: 1,
    });
    expect(second.ok).toBe(true);
    expect(second.share?.code).toBe(first.share?.code);

    const { db, sql } = createDb(databaseUrl);
    const events = await db
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.aggregateId, started.id));
    expect(events.some((e) => e.eventType === "puzzle.completed.v1")).toBe(
      true,
    );
    expect(events.every((e) => e.traceId)).toBeTruthy();
    await sql.end({ timeout: 5 });
  });
});
