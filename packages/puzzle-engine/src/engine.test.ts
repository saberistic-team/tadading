import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { canonicalizeRing, ringsEqualUpToSymmetry } from "./canonicalize.js";
import { getFallbackPuzzle } from "./fallback.js";
import { generatePuzzle } from "./generate.js";
import { scoreInRange } from "./difficulty.js";
import { createPrng } from "./prng.js";
import { assertNoSolutionLeak, serializePublicPuzzle } from "./serialize.js";
import {
  countCanonicalSolutions,
  isValidRing,
  solveRing,
} from "./solver.js";
import {
  areCompatible,
  makeTile,
  sharedAttributeCount,
} from "./tiles.js";
import { validateSubmittedRing } from "./validate.js";

describe("compatibility", () => {
  it("requires exactly one shared attribute", () => {
    const a = makeTile("circle", "coral", "solid", 1);
    const b = makeTile("circle", "teal", "striped", 2);
    expect(sharedAttributeCount(a, b)).toBe(1);
    expect(areCompatible(a, b)).toBe(true);

    const c = makeTile("circle", "coral", "striped", 2);
    expect(sharedAttributeCount(a, c)).toBe(2);
    expect(areCompatible(a, c)).toBe(false);
  });
});

describe("canonicalizeRing", () => {
  it("is invariant under rotation and reflection", () => {
    const ring = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ];
    const rotated = [...ring.slice(3), ...ring.slice(0, 3)];
    const reflected = [...ring].reverse();
    expect(canonicalizeRing(rotated)).toEqual(canonicalizeRing(ring));
    expect(canonicalizeRing(reflected)).toEqual(canonicalizeRing(ring));
    expect(ringsEqualUpToSymmetry(rotated, reflected)).toBe(true);
  });
});

describe("fallback puzzle", () => {
  it("has a valid unique canonical solution", () => {
    const puzzle = getFallbackPuzzle();
    expect(puzzle.tiles).toHaveLength(8);
    expect(isValidRing(puzzle.solutionOrder, puzzle.tiles)).toBe(true);
    expect(countCanonicalSolutions(puzzle.tiles, 2)).toBe(1);
    expect(
      validateSubmittedRing(puzzle, puzzle.solutionOrder).ok,
    ).toBe(true);
  });
});

describe("generatePuzzle", () => {
  it("is deterministic for the same seed", () => {
    const a = generatePuzzle("det-seed-1");
    const b = generatePuzzle("det-seed-1");
    expect(a.tiles.map((t) => t.id)).toEqual(b.tiles.map((t) => t.id));
    expect(a.initialOrder).toEqual(b.initialOrder);
    expect(a.solutionOrder).toEqual(b.solutionOrder);
    expect(a.canonicalSolutionHash).toEqual(b.canonicalSolutionHash);
  });

  it("produces eight distinct tiles and unique solutions for 1000 seeds", () => {
    const rng = createPrng("batch-seeds");
    let generated = 0;
    for (let i = 0; i < 1000; i += 1) {
      const seed = `batch:${i}:${rng.nextInt(1_000_000)}`;
      const puzzle = generatePuzzle(seed, { maxAttempts: 400 });
      expect(new Set(puzzle.tiles.map((t) => t.id)).size).toBe(8);
      expect(countCanonicalSolutions(puzzle.tiles, 2)).toBe(1);
      expect(isValidRing(puzzle.solutionOrder, puzzle.tiles)).toBe(true);
      expect(isValidRing(puzzle.initialOrder, puzzle.tiles)).toBe(false);
      expect(scoreInRange(puzzle.difficultyScore)).toBe(true);
      generated += 1;
    }
    expect(generated).toBe(1000);
  }, 120_000);

  it("public serialization never includes solution fields", () => {
    const puzzle = generatePuzzle("public-serialize");
    const pub = serializePublicPuzzle(puzzle, {
      id: "p1",
      publicationDay: "2026-08-04",
    });
    expect(() => assertNoSolutionLeak(pub)).not.toThrow();
    expect("solutionOrder" in pub).toBe(false);
    expect("canonicalSolutionHash" in pub).toBe(false);
  });

  it("rejects duplicate submissions and accepts rotations", () => {
    const puzzle = generatePuzzle("validate-rot");
    const dup = [...puzzle.solutionOrder];
    dup[1] = dup[0]!;
    expect(validateSubmittedRing(puzzle, dup).ok).toBe(false);

    const rotated = [
      ...puzzle.solutionOrder.slice(2),
      ...puzzle.solutionOrder.slice(0, 2),
    ];
    expect(validateSubmittedRing(puzzle, rotated).ok).toBe(true);
  });
});

describe("property checks", () => {
  it("generator yields unique-solution puzzles for arbitrary seeds", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 24 }), (seed) => {
        const puzzle = generatePuzzle(`fc:${seed}`, { maxAttempts: 300 });
        return (
          puzzle.tiles.length === 8 &&
          countCanonicalSolutions(puzzle.tiles, 2) === 1 &&
          solveRing(puzzle.tiles, 1).length === 1
        );
      }),
      { numRuns: 25 },
    );
  }, 60_000);
});
