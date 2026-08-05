import {
  COLOR_TOKENS,
  COUNTS,
  FILLS,
  SHAPES,
  type ColorToken,
  type Count,
  type Fill,
  type Shape,
  type Tile,
} from "./types.js";

export function tileId(
  shape: Shape,
  color: ColorToken,
  fill: Fill,
  count: Count,
): string {
  return `${shape}:${color}:${fill}:${count}`;
}

export function makeTile(
  shape: Shape,
  color: ColorToken,
  fill: Fill,
  count: Count,
): Tile {
  return {
    id: tileId(shape, color, fill, count),
    shape,
    color,
    fill,
    count,
  };
}

export function parseTileId(id: string): Tile {
  const parts = id.split(":");
  if (parts.length !== 4) {
    throw new Error(`Invalid tile id: ${id}`);
  }
  const [shape, color, fill, countRaw] = parts as [
    Shape,
    ColorToken,
    Fill,
    string,
  ];
  const count = Number(countRaw) as Count;
  if (
    !SHAPES.includes(shape) ||
    !COLOR_TOKENS.includes(color) ||
    !FILLS.includes(fill) ||
    !COUNTS.includes(count)
  ) {
    throw new Error(`Invalid tile id: ${id}`);
  }
  return makeTile(shape, color, fill, count);
}

export function allTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (const shape of SHAPES) {
    for (const color of COLOR_TOKENS) {
      for (const fill of FILLS) {
        for (const count of COUNTS) {
          tiles.push(makeTile(shape, color, fill, count));
        }
      }
    }
  }
  return tiles;
}

export function sharedAttributeCount(a: Tile, b: Tile): number {
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

export function tileMap(tiles: readonly Tile[]): Map<string, Tile> {
  const map = new Map<string, Tile>();
  for (const tile of tiles) {
    if (map.has(tile.id)) {
      throw new Error(`Duplicate tile id: ${tile.id}`);
    }
    map.set(tile.id, tile);
  }
  return map;
}
