import { areCompatible, tileMap } from "./tiles.js";
import type { Difficulty, Tile } from "./types.js";

export function scoreDifficulty(
  tiles: readonly Tile[],
  solutionOrder: readonly string[],
  initialOrder: readonly string[],
): number {
  const byId = tileMap(tiles);
  let edgeCount = 0;
  for (let i = 0; i < tiles.length; i += 1) {
    for (let j = i + 1; j < tiles.length; j += 1) {
      if (areCompatible(tiles[i]!, tiles[j]!)) edgeCount += 1;
    }
  }
  const maxEdges = (tiles.length * (tiles.length - 1)) / 2;
  const density = edgeCount / maxEdges;

  let misleading = 0;
  for (let i = 0; i < initialOrder.length; i += 1) {
    const a = byId.get(initialOrder[i]!)!;
    for (let j = 0; j < initialOrder.length; j += 1) {
      if (i === j) continue;
      const b = byId.get(initialOrder[j]!)!;
      if (!areCompatible(a, b)) continue;
      const solutionNeighbors = new Set([
        solutionOrder[(solutionOrder.indexOf(a.id) + 7) % 8]!,
        solutionOrder[(solutionOrder.indexOf(a.id) + 1) % 8]!,
      ]);
      if (!solutionNeighbors.has(b.id)) misleading += 1;
    }
  }

  const initialCorrect = countInitialCorrect(initialOrder, tiles);
  // Higher density + misleading edges + fewer free initial edges => harder
  const score = Math.round(
    density * 40 + misleading * 2 + (8 - initialCorrect) * 4,
  );
  return Math.min(100, Math.max(1, score));
}

function countInitialCorrect(
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

export function difficultyFromScore(score: number): Difficulty {
  if (score < 35) return "easy";
  if (score < 60) return "standard";
  return "tricky";
}

export function scoreInRange(score: number): boolean {
  return score >= 1 && score <= 100;
}
