import { canonicalizeRing } from "./canonicalize.js";
import { areCompatible, tileMap } from "./tiles.js";
import type { Tile } from "./types.js";

function buildAdj(tiles: readonly Tile[]): Map<string, string[]> {
  const ids = tiles.map((t) => t.id);
  const byId = tileMap(tiles);
  const adj = new Map<string, string[]>();
  for (const id of ids) {
    const neighbors: string[] = [];
    for (const other of ids) {
      if (id === other) continue;
      if (areCompatible(byId.get(id)!, byId.get(other)!)) {
        neighbors.push(other);
      }
    }
    adj.set(id, neighbors);
  }
  return adj;
}

export function countCorrectEdges(
  order: readonly string[],
  tiles: readonly Tile[],
): number {
  const byId = tileMap(tiles);
  let correct = 0;
  for (let i = 0; i < order.length; i += 1) {
    const a = byId.get(order[i]!)!;
    const b = byId.get(order[(i + 1) % order.length]!)!;
    if (areCompatible(a, b)) correct += 1;
  }
  return correct;
}

export function isValidRing(
  order: readonly string[],
  tiles: readonly Tile[],
): boolean {
  if (order.length !== tiles.length) return false;
  const ids = new Set(order);
  if (ids.size !== tiles.length) return false;
  for (const tile of tiles) {
    if (!ids.has(tile.id)) return false;
  }
  return countCorrectEdges(order, tiles) === order.length;
}

/**
 * Enumerate unique canonical circular solutions for the given tile set.
 * Returns up to `limit` canonical rings.
 */
export function solveRing(
  tiles: readonly Tile[],
  limit = 8,
): string[][] {
  if (tiles.length !== 8) {
    throw new Error("solveRing expects exactly 8 tiles");
  }

  const adj = buildAdj(tiles);
  const ids = tiles.map((t) => t.id).sort();
  const solutions = new Map<string, string[]>();
  const start = ids[0]!;
  const path: string[] = [start];
  const used = new Set<string>([start]);

  const dfs = (): void => {
    if (solutions.size >= limit) return;
    if (path.length === 8) {
      const first = path[0]!;
      const last = path[7]!;
      if ((adj.get(last) ?? []).includes(first)) {
        const canonical = canonicalizeRing(path);
        solutions.set(canonical.join("|"), canonical);
      }
      return;
    }

    const current = path[path.length - 1]!;
    for (const next of adj.get(current) ?? []) {
      if (used.has(next)) continue;
      // Keep the start tile as the lexicographically smallest unused-at-start
      // by only allowing starts from the global min id (fixed above).
      used.add(next);
      path.push(next);
      dfs();
      path.pop();
      used.delete(next);
      if (solutions.size >= limit) return;
    }
  };

  dfs();
  return [...solutions.values()];
}

export function countCanonicalSolutions(
  tiles: readonly Tile[],
  limit = 8,
): number {
  return solveRing(tiles, limit).length;
}
