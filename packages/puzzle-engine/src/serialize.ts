import type { PublicPuzzle, Puzzle } from "./types.js";

export function serializePublicPuzzle(
  puzzle: Puzzle,
  meta: { id: string; publicationDay: string },
): PublicPuzzle {
  return {
    id: meta.id,
    publicationDay: meta.publicationDay,
    generatorVersion: puzzle.generatorVersion,
    difficulty: puzzle.difficulty,
    tiles: puzzle.tiles,
    initialOrder: puzzle.initialOrder,
    difficultyScore: puzzle.difficultyScore,
  };
}

export function assertNoSolutionLeak(publicPuzzle: PublicPuzzle): void {
  const json = JSON.stringify(publicPuzzle);
  if (
    json.includes("solutionOrder") ||
    json.includes("canonicalSolutionHash") ||
    json.includes("solution")
  ) {
    throw new Error("Public puzzle serialization leaked solution data");
  }
}
