"use client";

import type { PublicPuzzleDto } from "@tadading/contracts";

type Tile = PublicPuzzleDto["tiles"][number];

const colorVars: Record<Tile["color"], string> = {
  coral: "var(--tile-coral)",
  teal: "var(--tile-teal)",
  gold: "var(--tile-gold)",
  violet: "var(--tile-violet)",
};

const shapeLabel: Record<Tile["shape"], string> = {
  circle: "circle",
  triangle: "triangle",
  square: "square",
  star: "star",
};

export function TileView({
  tile,
  selected,
  onSelect,
  index,
}: {
  tile: Tile;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const marks = tile.count === 2 ? "••" : "•";
  return (
    <button
      type="button"
      className={`tile ${selected ? "tile-selected" : ""} fill-${tile.fill}`}
      style={{ ["--tile-color" as string]: colorVars[tile.color] }}
      onClick={onSelect}
      aria-label={`${shapeLabel[tile.shape]}, ${tile.color}, ${tile.fill}, ${tile.count === 2 ? "two marks" : "one mark"}`}
      aria-pressed={selected}
      data-testid={`tile-${index}`}
    >
      <span className={`shape shape-${tile.shape}`} aria-hidden="true" />
      <span className="marks" aria-hidden="true">
        {marks}
      </span>
      <span className="sr-pattern" aria-hidden="true">
        {tile.fill === "striped" ? "striped" : "solid"}
      </span>
    </button>
  );
}
