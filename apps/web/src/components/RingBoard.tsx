"use client";

import type { PublicPuzzleDto } from "@tadading/contracts";
import { TileView } from "./TileView";

export function RingBoard({
  puzzle,
  order,
  selectedIndex,
  edgeOk,
  onSelect,
  celebrating,
}: {
  puzzle: PublicPuzzleDto;
  order: string[];
  selectedIndex: number | null;
  edgeOk: boolean[];
  onSelect: (index: number) => void;
  celebrating: boolean;
}) {
  const byId = new Map(puzzle.tiles.map((t) => [t.id, t]));

  return (
    <div
      className={`ring ${celebrating ? "ring-celebrate" : ""}`}
      role="group"
      aria-label="TadaDing ring puzzle"
      data-testid="ring-board"
    >
      {order.map((id, index) => {
        const tile = byId.get(id)!;
        const angle = (index / order.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 42;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        const nextOk = edgeOk[index] ?? false;
        return (
          <div
            key={`${id}-${index}`}
            className={`ring-slot ${nextOk ? "edge-ok" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <TileView
              tile={tile}
              index={index}
              selected={selectedIndex === index}
              onSelect={() => onSelect(index)}
            />
            <span
              className={`edge-marker ${nextOk ? "on" : ""}`}
              aria-hidden="true"
              title={nextOk ? "Connected" : "Not connected"}
            />
          </div>
        );
      })}
      <div className="ring-center" aria-hidden="true">
        {celebrating ? "ding!" : "swap"}
      </div>
    </div>
  );
}
