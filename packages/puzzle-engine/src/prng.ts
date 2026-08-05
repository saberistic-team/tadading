/** Deterministic Mulberry32 PRNG. Never use Math.random in this package. */
export type Prng = {
  next(): number;
  nextInt(maxExclusive: number): number;
  shuffle<T>(items: readonly T[]): T[];
};

export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createPrng(seed: string | number): Prng {
  let state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  if (state === 0) {
    state = 0x9e3779b9;
  }

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    nextInt(maxExclusive: number): number {
      if (maxExclusive <= 0) {
        throw new Error("maxExclusive must be positive");
      }
      return Math.floor(next() * maxExclusive);
    },
    shuffle<T>(items: readonly T[]): T[] {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        const tmp = copy[i]!;
        copy[i] = copy[j]!;
        copy[j] = tmp;
      }
      return copy;
    },
  };
}
