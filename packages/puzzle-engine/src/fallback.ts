import { hashCanonicalSolution } from "./hash.js";
import { isValidRing, countCanonicalSolutions } from "./solver.js";
import { makeTile } from "./tiles.js";
import { GENERATOR_VERSION, type Puzzle } from "./types.js";

/**
 * Hard-coded emergency fallback — verified in unit tests to have exactly one
 * canonical solution.
 */
const FALLBACK_TILES = [
  makeTile("circle", "coral", "solid", 1),
  makeTile("circle", "teal", "striped", 2),
  makeTile("triangle", "teal", "solid", 1),
  makeTile("triangle", "gold", "striped", 2),
  makeTile("square", "gold", "solid", 1),
  makeTile("square", "violet", "striped", 2),
  makeTile("star", "violet", "solid", 1),
  makeTile("star", "coral", "striped", 2),
] as const;

// Constructed ring: each neighbor shares exactly one attribute by design.
const FALLBACK_SOLUTION = [
  "circle:coral:solid:1",
  "star:coral:striped:2",
  "star:violet:solid:1",
  "square:violet:striped:2",
  "square:gold:solid:1",
  "triangle:gold:striped:2",
  "triangle:teal:solid:1",
  "circle:teal:striped:2",
] as const;

const FALLBACK_INITIAL = [
  "circle:coral:solid:1",
  "triangle:teal:solid:1",
  "star:coral:striped:2",
  "square:gold:solid:1",
  "star:violet:solid:1",
  "circle:teal:striped:2",
  "square:violet:striped:2",
  "triangle:gold:striped:2",
] as const;

export function getFallbackPuzzle(): Puzzle {
  const tiles = [...FALLBACK_TILES];
  const solutionOrder = [...FALLBACK_SOLUTION];
  if (!isValidRing(solutionOrder, tiles)) {
    throw new Error("Fallback solution ring is invalid");
  }
  if (countCanonicalSolutions(tiles, 2) !== 1) {
    throw new Error("Fallback puzzle must have exactly one canonical solution");
  }

  return {
    generatorVersion: GENERATOR_VERSION,
    seed: "fallback:v1",
    difficulty: "standard",
    tiles,
    initialOrder: [...FALLBACK_INITIAL],
    solutionOrder,
    canonicalSolutionHash: hashCanonicalSolution(solutionOrder),
    difficultyScore: 45,
  };
}
