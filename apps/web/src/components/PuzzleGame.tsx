"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicPuzzleDto } from "@tadading/contracts";
import { completePuzzle } from "../lib/api";
import { loadBoard, saveBoard, swapIndices, type BoardState } from "../lib/board";
import { edgeStatuses, isRingComplete } from "../lib/compat";
import { loadMuted, playTaDaDing, setMuted } from "../lib/sound";
import { RingBoard } from "./RingBoard";

export function PuzzleGame({ puzzle }: { puzzle: PublicPuzzleDto }) {
  const [state, setState] = useState<BoardState>(() => loadBoard(puzzle));
  const [muted, setMutedState] = useState(false);
  const [serverOk, setServerOk] = useState<boolean | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const edges = useMemo(
    () => edgeStatuses(puzzle, state.order),
    [puzzle, state.order],
  );

  useEffect(() => {
    setMutedState(loadMuted());
  }, []);

  useEffect(() => {
    saveBoard(puzzle.id, state);
  }, [puzzle.id, state]);

  useEffect(() => {
    if (!state.completed && isRingComplete(puzzle, state.order)) {
      playTaDaDing();
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(40);
      }
      setState((prev) => ({ ...prev, completed: true, selectedIndex: null }));
      void completePuzzle(puzzle.id, state.order).then((result) => {
        setServerOk(result.ok);
      });
    }
  }, [puzzle, state.order, state.completed]);

  function select(index: number): void {
    if (state.completed) return;
    setState((prev) => {
      if (prev.selectedIndex === null) {
        return { ...prev, selectedIndex: index };
      }
      if (prev.selectedIndex === index) {
        return { ...prev, selectedIndex: null };
      }
      const nextOrder = swapIndices(prev.order, prev.selectedIndex, index);
      return {
        ...prev,
        order: nextOrder,
        selectedIndex: null,
        history: [...prev.history, prev.order],
      };
    });
  }

  function undo(): void {
    setState((prev) => {
      if (prev.history.length === 0 || prev.completed) return prev;
      const history = [...prev.history];
      const order = history.pop()!;
      return { ...prev, order, history, selectedIndex: null };
    });
  }

  function reset(): void {
    setState({
      order: [...puzzle.initialOrder],
      selectedIndex: null,
      history: [],
      completed: false,
    });
    setServerOk(null);
    setHint(null);
  }

  function requestHint(): void {
    const broken = edges.findIndex((ok) => !ok);
    if (broken === -1) {
      setHint("Every neighbor already fits.");
      return;
    }
    setHint(
      `Look at tiles ${broken + 1} and ${(broken + 1) % 8 + 1} — they should share exactly one trait.`,
    );
  }

  return (
    <div className="game">
      <RingBoard
        puzzle={puzzle}
        order={state.order}
        selectedIndex={state.selectedIndex}
        edgeOk={edges}
        onSelect={select}
        celebrating={state.completed}
      />

      <div className="game-toolbar" role="toolbar" aria-label="Puzzle controls">
        <button type="button" onClick={undo} disabled={state.history.length === 0 || state.completed}>
          Undo
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={requestHint} disabled={state.completed}>
          Hint
        </button>
        <button
          type="button"
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
          }}
        >
          {muted ? "Sound off" : "Sound on"}
        </button>
      </div>

      {hint ? <p className="hint">{hint}</p> : null}

      {state.completed ? (
        <div className="complete" data-testid="completion">
          <h2>Ta-da-ding!</h2>
          <p>Your daily tiny win is complete.</p>
          {serverOk === false ? (
            <p className="meta">Local complete — server could not confirm yet.</p>
          ) : null}
          <p className="cta-note">
            <a href="/" className="quiet-link">
              Save my streak
            </a>{" "}
            arrives in a later phase. Keep playing as a guest for now.
          </p>
        </div>
      ) : (
        <p className="meta">
          Tap two tiles to swap. Connected neighbors show a link mark — not color
          alone.
        </p>
      )}
    </div>
  );
}
