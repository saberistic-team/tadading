import { Injectable } from "@nestjs/common";
import type { PublicPuzzleDto } from "@tadading/contracts";
import { createDb, dailyPuzzles, type DailyPuzzleRow } from "@tadading/db";
import {
  getFallbackPuzzle,
  hashCanonicalSolution,
  isValidRing,
  makeTile,
  parseTileId,
  serializePublicPuzzle,
  type Tile,
} from "@tadading/puzzle-engine";
import { and, desc, eq, or } from "drizzle-orm";

function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function rowToPublic(row: DailyPuzzleRow): PublicPuzzleDto {
  const tiles = (row.publicTiles as Tile[]).map((tile) =>
    makeTile(tile.shape, tile.color, tile.fill, tile.count),
  );
  return {
    id: row.id,
    publicationDay: row.publicationDay,
    generatorVersion: row.generatorVersion,
    difficulty: row.difficulty,
    tiles,
    initialOrder: row.initialOrder as string[],
    difficultyScore: row.difficultyScore,
  };
}

@Injectable()
export class PuzzlesService {
  constructor(private readonly databaseUrl: string) {}

  async getToday(): Promise<PublicPuzzleDto> {
    const { db, sql } = createDb(this.databaseUrl);
    try {
      const today = utcDay();
      const rows = await db
        .select()
        .from(dailyPuzzles)
        .where(
          and(
            eq(dailyPuzzles.publicationDay, today),
            or(
              eq(dailyPuzzles.status, "published"),
              eq(dailyPuzzles.status, "fallback"),
            ),
          ),
        )
        .limit(1);

      if (rows[0]) {
        return rowToPublic(rows[0]);
      }

      const fallbackRows = await db
        .select()
        .from(dailyPuzzles)
        .where(eq(dailyPuzzles.status, "fallback"))
        .orderBy(desc(dailyPuzzles.createdAt))
        .limit(1);

      if (fallbackRows[0]) {
        return rowToPublic(fallbackRows[0]);
      }

      const fallback = getFallbackPuzzle();
      const pub = serializePublicPuzzle(fallback, {
        id: "fallback-memory",
        publicationDay: today,
      });
      return {
        ...pub,
        tiles: [...pub.tiles],
        initialOrder: [...pub.initialOrder],
      };
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  async complete(
    puzzleId: string,
    order: string[],
  ): Promise<{ ok: boolean; reason?: string }> {
    const { db, sql } = createDb(this.databaseUrl);
    try {
      const rows = await db
        .select()
        .from(dailyPuzzles)
        .where(eq(dailyPuzzles.id, puzzleId))
        .limit(1);

      const row = rows[0];
      if (!row) {
        return { ok: false, reason: "puzzle_not_found" };
      }

      const tiles = (row.publicTiles as Tile[]).map((t) => parseTileId(t.id));
      if (!isValidRing(order, tiles)) {
        return { ok: false, reason: "incompatible_ring" };
      }
      if (hashCanonicalSolution(order) !== row.canonicalSolutionHash) {
        return { ok: false, reason: "solution_hash_mismatch" };
      }
      return { ok: true };
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
}
