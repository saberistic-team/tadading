export const SHAPES = ["circle", "triangle", "square", "star"] as const;
export type Shape = (typeof SHAPES)[number];

export const COLOR_TOKENS = ["coral", "teal", "gold", "violet"] as const;
export type ColorToken = (typeof COLOR_TOKENS)[number];

export const FILLS = ["solid", "striped"] as const;
export type Fill = (typeof FILLS)[number];

export const COUNTS = [1, 2] as const;
export type Count = (typeof COUNTS)[number];

export type Tile = {
  readonly id: string;
  readonly shape: Shape;
  readonly color: ColorToken;
  readonly fill: Fill;
  readonly count: Count;
};

export const GENERATOR_VERSION = "1" as const;

export type Difficulty = "easy" | "standard" | "tricky";

export type Puzzle = {
  readonly generatorVersion: typeof GENERATOR_VERSION;
  readonly seed: string;
  readonly difficulty: Difficulty;
  readonly tiles: readonly Tile[];
  readonly initialOrder: readonly string[];
  readonly solutionOrder: readonly string[];
  readonly canonicalSolutionHash: string;
  readonly difficultyScore: number;
};

export type PublicPuzzle = {
  readonly id: string;
  readonly publicationDay: string;
  readonly generatorVersion: typeof GENERATOR_VERSION;
  readonly difficulty: Difficulty;
  readonly tiles: readonly Tile[];
  readonly initialOrder: readonly string[];
  readonly difficultyScore: number;
};

export type GenerateConstraints = {
  readonly difficulty?: Difficulty;
  readonly maxAttempts?: number;
  readonly maxCorrectInitialEdges?: number;
};
