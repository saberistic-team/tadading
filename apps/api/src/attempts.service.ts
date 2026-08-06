import { Injectable } from "@nestjs/common";
import type {
  AttemptResponse,
  CompleteAttemptResponse,
} from "@tadading/contracts";
import { createEntityId } from "@tadading/domain";
import {
  createDb,
  dailyPuzzles,
  guestStreaks,
  insertOutboxEvent,
  outboxEvents,
  puzzleAttempts,
  type PuzzleAttemptRow,
} from "@tadading/db";
import {
  createEnvelope,
  EVENT_TYPES,
  attemptStartedPayloadSchema,
  attemptStateSavedPayloadSchema,
  puzzleCompletedPayloadSchema,
  streakUpdatedPayloadSchema,
} from "@tadading/events";
import {
  areCompatible,
  hashCanonicalSolution,
  isValidRing,
  parseTileId,
  type Tile,
} from "@tadading/puzzle-engine";
import { and, asc, eq, isNull } from "drizzle-orm";
import { hashOrder, newTraceId } from "./hash-utils.js";
import { buildShareResult } from "./share.js";
import { nextGuestStreak } from "./streaks.js";

function toAttemptResponse(
  row: PuzzleAttemptRow,
  traceId: string | null = null,
): AttemptResponse {
  return {
    id: row.id,
    puzzleId: row.puzzleId,
    clientAttemptId: row.clientAttemptId,
    currentOrder: (row.currentOrder as string[] | null) ?? null,
    moves: row.moves,
    hintCount: row.hintCount,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    shareCode: row.shareCode,
    traceId,
  };
}

@Injectable()
export class AttemptsService {
  constructor(private readonly databaseUrl: string) {}

  async start(input: {
    puzzleId: string;
    guestIdHash: string | null;
    clientAttemptId: string;
    clientVersion: string;
    initialOrder: string[];
  }): Promise<AttemptResponse> {
    const { db, sql } = createDb(this.databaseUrl);
    const traceId = newTraceId();
    try {
      const existing = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.clientAttemptId, input.clientAttemptId))
        .limit(1);
      if (existing[0]) {
        return toAttemptResponse(existing[0], traceId);
      }

      const puzzleRows = await db
        .select()
        .from(dailyPuzzles)
        .where(eq(dailyPuzzles.id, input.puzzleId))
        .limit(1);
      const puzzle = puzzleRows[0];
      if (!puzzle) {
        throw new Error("puzzle_not_found");
      }

      const id = createEntityId();
      const startedAt = new Date();
      const payload = attemptStartedPayloadSchema.parse({
        attemptId: id,
        puzzleId: input.puzzleId,
        guestIdHash: input.guestIdHash,
        clientAttemptId: input.clientAttemptId,
        publicationDay: puzzle.publicationDay,
      });
      const envelope = createEnvelope({
        id: createEntityId(),
        type: EVENT_TYPES.attemptStarted,
        version: 1,
        aggregateType: "puzzle_attempt",
        aggregateId: id,
        payload,
        traceId,
        occurredAt: startedAt,
      });

      await db.transaction(async (tx) => {
        await tx.insert(puzzleAttempts).values({
          id,
          puzzleId: input.puzzleId,
          guestIdHash: input.guestIdHash,
          clientAttemptId: input.clientAttemptId,
          initialOrderHash: hashOrder(input.initialOrder),
          currentOrder: input.initialOrder,
          startedAt,
          moves: 0,
          hintCount: 0,
          clientVersion: input.clientVersion,
        });
        await insertOutboxEvent(tx, envelope);
      });

      const rows = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, id))
        .limit(1);
      return toAttemptResponse(rows[0]!, traceId);
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  async saveState(input: {
    attemptId: string;
    guestIdHash: string | null;
    currentOrder: string[];
    moves: number;
    hintCount?: number;
  }): Promise<AttemptResponse> {
    const { db, sql } = createDb(this.databaseUrl);
    const traceId = newTraceId();
    try {
      const rows = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, input.attemptId))
        .limit(1);
      const attempt = rows[0];
      if (!attempt) throw new Error("attempt_not_found");
      if (
        input.guestIdHash &&
        attempt.guestIdHash &&
        attempt.guestIdHash !== input.guestIdHash
      ) {
        throw new Error("forbidden");
      }
      if (attempt.completedAt) {
        return toAttemptResponse(attempt, traceId);
      }

      const now = new Date();
      const payload = attemptStateSavedPayloadSchema.parse({
        attemptId: attempt.id,
        puzzleId: attempt.puzzleId,
        moves: input.moves,
        hintCount: input.hintCount ?? attempt.hintCount,
      });
      const envelope = createEnvelope({
        id: createEntityId(),
        type: EVENT_TYPES.attemptStateSaved,
        version: 1,
        aggregateType: "puzzle_attempt",
        aggregateId: attempt.id,
        payload,
        traceId,
        occurredAt: now,
      });

      await db.transaction(async (tx) => {
        await tx
          .update(puzzleAttempts)
          .set({
            currentOrder: input.currentOrder,
            moves: input.moves,
            hintCount: input.hintCount ?? attempt.hintCount,
            lastSavedAt: now,
            updatedAt: now,
          })
          .where(eq(puzzleAttempts.id, attempt.id));
        await insertOutboxEvent(tx, envelope);
      });

      const updated = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, attempt.id))
        .limit(1);
      return toAttemptResponse(updated[0]!, traceId);
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  async complete(input: {
    attemptId: string;
    guestIdHash: string | null;
    order: string[];
    moves: number;
    hintCount: number;
    durationMs: number;
  }): Promise<CompleteAttemptResponse> {
    const { db, sql } = createDb(this.databaseUrl);
    const traceId = newTraceId();
    try {
      const rows = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, input.attemptId))
        .limit(1);
      const attempt = rows[0];
      if (!attempt) {
        return { ok: false, reason: "attempt_not_found" };
      }
      if (
        input.guestIdHash &&
        attempt.guestIdHash &&
        attempt.guestIdHash !== input.guestIdHash
      ) {
        return { ok: false, reason: "forbidden" };
      }

      const puzzleRows = await db
        .select()
        .from(dailyPuzzles)
        .where(eq(dailyPuzzles.id, attempt.puzzleId))
        .limit(1);
      const puzzle = puzzleRows[0];
      if (!puzzle) return { ok: false, reason: "puzzle_not_found" };

      if (attempt.completedAt) {
        const share = attempt.shareCode
          ? buildShareResult({
              attemptId: attempt.id,
              publicationDay: puzzle.publicationDay,
              moves: attempt.moves,
              durationMs: attempt.durationMs ?? 0,
            })
          : undefined;
        const events = await db
          .select({ id: outboxEvents.id })
          .from(outboxEvents)
          .where(eq(outboxEvents.aggregateId, attempt.id));
        return {
          ok: true,
          attemptId: attempt.id,
          share: share
            ? {
                code: share.code,
                text: share.text,
                moves: attempt.moves,
                durationMs: attempt.durationMs ?? 0,
                day: puzzle.publicationDay,
              }
            : undefined,
          eventIds: events.map((e) => e.id),
          traceId,
        };
      }

      const tiles = (puzzle.publicTiles as Tile[]).map((t) =>
        parseTileId(t.id),
      );
      if (!isValidRing(input.order, tiles)) {
        return { ok: false, reason: "incompatible_ring" };
      }
      if (hashCanonicalSolution(input.order) !== puzzle.canonicalSolutionHash) {
        return { ok: false, reason: "solution_hash_mismatch" };
      }

      const share = buildShareResult({
        attemptId: attempt.id,
        publicationDay: puzzle.publicationDay,
        moves: input.moves,
        durationMs: input.durationMs,
      });
      const now = new Date();
      const eventIds: string[] = [];

      const completedPayload = puzzleCompletedPayloadSchema.parse({
        attemptId: attempt.id,
        puzzleId: puzzle.id,
        guestIdHash: attempt.guestIdHash,
        publicationDay: puzzle.publicationDay,
        moves: input.moves,
        hintCount: input.hintCount,
        durationMs: input.durationMs,
        shareCode: share.code,
      });
      const completedEnvelope = createEnvelope({
        id: createEntityId(),
        type: EVENT_TYPES.puzzleCompleted,
        version: 1,
        aggregateType: "puzzle_attempt",
        aggregateId: attempt.id,
        payload: completedPayload,
        traceId,
        occurredAt: now,
      });
      eventIds.push(completedEnvelope.id);

      let streakResult: CompleteAttemptResponse["streak"];

      await db.transaction(async (tx) => {
        await tx
          .update(puzzleAttempts)
          .set({
            currentOrder: input.order,
            moves: input.moves,
            hintCount: input.hintCount,
            durationMs: input.durationMs,
            completedAt: now,
            completionOrderHash: hashOrder(input.order),
            shareCode: share.code,
            lastSavedAt: now,
            updatedAt: now,
          })
          .where(
            and(
              eq(puzzleAttempts.id, attempt.id),
              isNull(puzzleAttempts.completedAt),
            ),
          );
        await insertOutboxEvent(tx, completedEnvelope);

        if (attempt.guestIdHash) {
          const streakRows = await tx
            .select()
            .from(guestStreaks)
            .where(eq(guestStreaks.guestIdHash, attempt.guestIdHash))
            .limit(1);
          const previous = streakRows[0]
            ? {
                currentCount: streakRows[0].currentCount,
                longestCount: streakRows[0].longestCount,
                lastCompletedDay: streakRows[0].lastCompletedDay,
              }
            : null;
          const next = nextGuestStreak(previous, puzzle.publicationDay);
          streakResult = next;
          await tx
            .insert(guestStreaks)
            .values({
              guestIdHash: attempt.guestIdHash,
              currentCount: next.currentCount,
              longestCount: next.longestCount,
              lastCompletedDay: next.lastCompletedDay,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: guestStreaks.guestIdHash,
              set: {
                currentCount: next.currentCount,
                longestCount: next.longestCount,
                lastCompletedDay: next.lastCompletedDay,
                updatedAt: now,
              },
            });

          const streakEnvelope = createEnvelope({
            id: createEntityId(),
            type: EVENT_TYPES.streakUpdated,
            version: 1,
            aggregateType: "guest_streak",
            aggregateId: attempt.guestIdHash,
            payload: streakUpdatedPayloadSchema.parse({
              guestIdHash: attempt.guestIdHash,
              currentCount: next.currentCount,
              longestCount: next.longestCount,
              lastCompletedDay: next.lastCompletedDay!,
            }),
            traceId,
            occurredAt: now,
          });
          eventIds.push(streakEnvelope.id);
          await insertOutboxEvent(tx, streakEnvelope);
        }
      });

      return {
        ok: true,
        attemptId: attempt.id,
        share: {
          code: share.code,
          text: share.text,
          moves: input.moves,
          durationMs: input.durationMs,
          day: puzzle.publicationDay,
        },
        streak: streakResult,
        eventIds,
        traceId,
      };
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  async hint(input: {
    attemptId: string;
    guestIdHash: string | null;
    currentOrder: string[];
  }): Promise<{
    message: string;
    hintCount: number;
    edgeIndex: number | null;
  }> {
    const { db, sql } = createDb(this.databaseUrl);
    try {
      const rows = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, input.attemptId))
        .limit(1);
      const attempt = rows[0];
      if (!attempt) throw new Error("attempt_not_found");
      if (attempt.completedAt) {
        return {
          message: "Ring already complete.",
          hintCount: attempt.hintCount,
          edgeIndex: null,
        };
      }

      const puzzleRows = await db
        .select()
        .from(dailyPuzzles)
        .where(eq(dailyPuzzles.id, attempt.puzzleId))
        .limit(1);
      const puzzle = puzzleRows[0];
      if (!puzzle) throw new Error("puzzle_not_found");
      const byId = new Map(
        (puzzle.publicTiles as Tile[]).map((t) => [t.id, parseTileId(t.id)]),
      );

      let edgeIndex: number | null = null;
      for (let i = 0; i < input.currentOrder.length; i += 1) {
        const a = byId.get(input.currentOrder[i]!)!;
        const b = byId.get(
          input.currentOrder[(i + 1) % input.currentOrder.length]!,
        )!;
        if (!areCompatible(a, b)) {
          edgeIndex = i;
          break;
        }
      }

      const hintCount = attempt.hintCount + 1;
      await db
        .update(puzzleAttempts)
        .set({
          hintCount,
          currentOrder: input.currentOrder,
          lastSavedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(puzzleAttempts.id, attempt.id));

      return {
        message:
          edgeIndex === null
            ? "Every neighbor already fits."
            : `Check tiles ${edgeIndex + 1} and ${(edgeIndex + 1) % 8 + 1} — they should share exactly one trait.`,
        hintCount,
        edgeIndex,
      };
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  async getAttempt(
    attemptId: string,
    guestIdHash: string | null,
  ): Promise<
    AttemptResponse & {
      events: Array<{ id: string; eventType: string; traceId: string | null }>;
    }
  > {
    const { db, sql } = createDb(this.databaseUrl);
    try {
      const rows = await db
        .select()
        .from(puzzleAttempts)
        .where(eq(puzzleAttempts.id, attemptId))
        .limit(1);
      const attempt = rows[0];
      if (!attempt) throw new Error("attempt_not_found");
      if (
        guestIdHash &&
        attempt.guestIdHash &&
        attempt.guestIdHash !== guestIdHash
      ) {
        throw new Error("forbidden");
      }

      const events = await db
        .select({
          id: outboxEvents.id,
          eventType: outboxEvents.eventType,
          traceId: outboxEvents.traceId,
        })
        .from(outboxEvents)
        .where(eq(outboxEvents.aggregateId, attemptId))
        .orderBy(asc(outboxEvents.occurredAt));

      return {
        ...toAttemptResponse(attempt),
        events,
      };
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
}
