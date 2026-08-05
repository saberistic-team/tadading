import { ringsEqualUpToSymmetry } from "./canonicalize.js";
import { hashCanonicalSolution } from "./hash.js";
import { isValidRing } from "./solver.js";
import { parseTileId, tileMap } from "./tiles.js";
import type { Puzzle } from "./types.js";

export type ValidationResult =
  | { readonly ok: true; readonly canonicalSolutionHash: string }
  | { readonly ok: false; readonly reason: string };

export function validateSubmittedRing(
  puzzle: Pick<Puzzle, "tiles" | "canonicalSolutionHash" | "solutionOrder">,
  submittedTileIds: readonly string[],
): ValidationResult {
  if (submittedTileIds.length !== 8) {
    return { ok: false, reason: "expected_eight_tiles" };
  }

  const unique = new Set(submittedTileIds);
  if (unique.size !== 8) {
    return { ok: false, reason: "duplicate_tiles" };
  }

  try {
    for (const id of submittedTileIds) {
      parseTileId(id);
    }
  } catch {
    return { ok: false, reason: "invalid_tile_id" };
  }

  const byId = tileMap(puzzle.tiles);
  for (const id of submittedTileIds) {
    if (!byId.has(id)) {
      return { ok: false, reason: "tile_not_in_puzzle" };
    }
  }

  if (!isValidRing(submittedTileIds, puzzle.tiles)) {
    return { ok: false, reason: "incompatible_ring" };
  }

  if (!ringsEqualUpToSymmetry(submittedTileIds, puzzle.solutionOrder)) {
    // Unique-solution puzzles should not hit this if the ring is valid,
    // but keep the guard for safety.
    return { ok: false, reason: "not_canonical_solution" };
  }

  const hash = hashCanonicalSolution(submittedTileIds);
  if (hash !== puzzle.canonicalSolutionHash) {
    return { ok: false, reason: "solution_hash_mismatch" };
  }

  return { ok: true, canonicalSolutionHash: hash };
}
