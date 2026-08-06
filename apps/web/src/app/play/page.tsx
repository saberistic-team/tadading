"use client";

import { useEffect, useState } from "react";
import type { PublicPuzzleDto } from "@tadading/contracts";
import { PuzzleGame } from "../../components/PuzzleGame";
import { fetchTodayPuzzle } from "../../lib/api";
import { getOrCreateGuestId } from "../../lib/guest";

export default function PlayPage() {
  const [puzzle, setPuzzle] = useState<PublicPuzzleDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateGuestId();
    void fetchTodayPuzzle()
      .then(setPuzzle)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load puzzle");
      });
  }, []);

  if (error) {
    return (
      <main className="page">
        <h1>Could not load today&apos;s puzzle</h1>
        <p className="meta">{error}</p>
      </main>
    );
  }

  if (!puzzle) {
    return (
      <main className="page">
        <p className="meta" data-testid="loading">
          Loading today&apos;s ring…
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Today · {puzzle.publicationDay}</p>
      <h1>Close the ring</h1>
      <PuzzleGame puzzle={puzzle} />
    </main>
  );
}
