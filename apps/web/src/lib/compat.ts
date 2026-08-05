import type { PublicPuzzleDto } from "@tadading/contracts";

type Tile = PublicPuzzleDto["tiles"][number];

function sharedAttributeCount(a: Tile, b: Tile): number {
  let shared = 0;
  if (a.shape === b.shape) shared += 1;
  if (a.color === b.color) shared += 1;
  if (a.fill === b.fill) shared += 1;
  if (a.count === b.count) shared += 1;
  return shared;
}

export function areCompatible(a: Tile, b: Tile): boolean {
  return sharedAttributeCount(a, b) === 1;
}

export function edgeStatuses(
  puzzle: PublicPuzzleDto,
  order: string[],
): boolean[] {
  const byId = new Map(puzzle.tiles.map((t) => [t.id, t]));
  return order.map((id, i) => {
    const a = byId.get(id)!;
    const b = byId.get(order[(i + 1) % order.length]!)!;
    return areCompatible(a, b);
  });
}

export function isRingComplete(
  puzzle: PublicPuzzleDto,
  order: string[],
): boolean {
  return edgeStatuses(puzzle, order).every(Boolean);
}
