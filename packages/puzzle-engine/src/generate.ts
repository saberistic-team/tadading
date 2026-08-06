import { hashCanonicalSolution } from "./hash.js";
import { createPrng } from "./prng.js";
import { difficultyFromScore, scoreDifficulty } from "./difficulty.js";
import {
  countCanonicalSolutions,
  countCorrectEdges,
  isValidRing,
  solveRing,
} from "./solver.js";
import { allTiles, areCompatible } from "./tiles.js";
import {
  GENERATOR_VERSION,
  type Difficulty,
  type GenerateConstraints,
  type Puzzle,
  type Tile,
} from "./types.js";

const UNIVERSE = allTiles();

function pickTileSet(rng: ReturnType<typeof createPrng>): Tile[] {
  // Construct a valid ring, then keep those 8 tiles.
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const pool = rng.shuffle(UNIVERSE);
    const path: Tile[] = [pool[0]!];
    const used = new Set<string>([path[0]!.id]);

    while (path.length < 8) {
      const current = path[path.length - 1]!;
      const candidates = pool.filter(
        (tile) => !used.has(tile.id) && areCompatible(current, tile),
      );
      if (candidates.length === 0) break;
      const next = candidates[rng.nextInt(candidates.length)]!;
      path.push(next);
      used.add(next.id);
    }

    if (path.length !== 8) continue;
    if (!areCompatible(path[7]!, path[0]!)) continue;
    return path;
  }

  // Fallback: take a known-good constructive walk with retries on sorted pool
  throw new Error("Unable to construct a compatible 8-tile set");
}

function scrambleInitial(
  rng: ReturnType<typeof createPrng>,
  solution: readonly string[],
  tiles: readonly Tile[],
  maxCorrectEdges: number,
): string[] | undefined {
  for (let i = 0; i < 120; i += 1) {
    const order = rng.shuffle(solution);
    if (isValidRing(order, tiles)) continue; // reject already solved
    const correct = countCorrectEdges(order, tiles);
    if (correct <= maxCorrectEdges) {
      return order;
    }
  }
  return undefined;
}

export function generatePuzzle(
  seed: string,
  constraints: GenerateConstraints = {},
): Puzzle {
  const rng = createPrng(seed);
  const maxAttempts = constraints.maxAttempts ?? 200;
  const maxCorrectInitialEdges = constraints.maxCorrectInitialEdges ?? 2;
  const wantedDifficulty = constraints.difficulty;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let tiles: Tile[];
    try {
      tiles = pickTileSet(rng);
    } catch {
      continue;
    }

    if (countCanonicalSolutions(tiles, 2) !== 1) continue;
    const solutions = solveRing(tiles, 1);
    const solutionOrder = solutions[0];
    if (!solutionOrder) continue;

    const initialOrder = scrambleInitial(
      rng,
      solutionOrder,
      tiles,
      maxCorrectInitialEdges,
    );
    if (!initialOrder) continue;

    const difficultyScore = scoreDifficulty(tiles, solutionOrder, initialOrder);
    const difficulty: Difficulty =
      wantedDifficulty ?? difficultyFromScore(difficultyScore);

    if (wantedDifficulty && difficultyFromScore(difficultyScore) !== wantedDifficulty) {
      // Soft filter — allow near-band for standard to improve yield
      if (
        wantedDifficulty === "standard" &&
        difficultyScore >= 30 &&
        difficultyScore <= 70
      ) {
        // ok
      } else if (wantedDifficulty !== difficultyFromScore(difficultyScore)) {
        continue;
      }
    }

    return {
      generatorVersion: GENERATOR_VERSION,
      seed,
      difficulty,
      tiles: [...tiles].sort((a, b) => a.id.localeCompare(b.id)),
      initialOrder,
      solutionOrder,
      canonicalSolutionHash: hashCanonicalSolution(solutionOrder),
      difficultyScore,
    };
  }

  throw new Error(
    `Failed to generate puzzle for seed=${seed} after ${maxAttempts} attempts`,
  );
}
