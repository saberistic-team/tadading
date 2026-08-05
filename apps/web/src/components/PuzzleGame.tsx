"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CompleteAttemptResponse, PublicPuzzleDto } from "@tadading/contracts";
import {
  completeAttempt,
  requestHint,
  saveAttemptState,
  startAttempt,
} from "../lib/api";
import { loadBoard, saveBoard, swapIndices, type BoardState } from "../lib/board";
import { edgeStatuses, isRingComplete } from "../lib/compat";
import { loadMuted, playTaDaDing, setMuted } from "../lib/sound";
import {
  applyLocalStreakDay,
  loadLocalStreak,
  saveLocalStreak,
  type LocalStreak,
} from "../lib/streak";
import { RingBoard } from "./RingBoard";

export function PuzzleGame({ puzzle }: { puzzle: PublicPuzzleDto }) {
  const [state, setState] = useState<BoardState>(() => loadBoard(puzzle));
  const [muted, setMutedState] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [share, setShare] = useState<
    NonNullable<CompleteAttemptResponse["share"]> | null
  >(null);
  const [streak, setStreak] = useState<LocalStreak>(() => loadLocalStreak());
  const [traceId, setTraceId] = useState<string | null>(null);
  const completingRef = useRef(false);

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
    let cancelled = false;
    void startAttempt({
      puzzleId: puzzle.id,
      clientAttemptId: state.clientAttemptId,
      initialOrder: puzzle.initialOrder,
    }).then((attempt) => {
      if (cancelled) return;
      setState((prev) => {
        const serverCompleted = Boolean(attempt.completedAt);
        const preferServerOrder =
          serverCompleted ||
          (attempt.moves > 0 && Array.isArray(attempt.currentOrder));
        return {
          ...prev,
          attemptId: attempt.id,
          ...(preferServerOrder && attempt.currentOrder
            ? { order: attempt.currentOrder }
            : {}),
          moves: Math.max(prev.moves, attempt.moves),
          hintCount: Math.max(prev.hintCount, attempt.hintCount),
          completed: serverCompleted || prev.completed,
        };
      });
      if (attempt.traceId) setTraceId(attempt.traceId);
    });
    return () => {
      cancelled = true;
    };
  }, [puzzle.id, state.clientAttemptId, puzzle.initialOrder]);

  useEffect(() => {
    if (!state.attemptId || state.completed) return;
    const handle = window.setTimeout(() => {
      void saveAttemptState({
        attemptId: state.attemptId!,
        currentOrder: state.order,
        moves: state.moves,
        hintCount: state.hintCount,
      }).catch(() => undefined);
    }, 400);
    return () => window.clearTimeout(handle);
  }, [
    state.attemptId,
    state.order,
    state.moves,
    state.hintCount,
    state.completed,
  ]);

  useEffect(() => {
    if (
      state.completed ||
      completingRef.current ||
      !state.attemptId ||
      !isRingComplete(puzzle, state.order)
    ) {
      return;
    }
    completingRef.current = true;
    playTaDaDing();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(40);
    }
    const durationMs = Math.max(0, Date.now() - state.startedAtMs);
    void completeAttempt({
      attemptId: state.attemptId,
      order: state.order,
      moves: state.moves,
      hintCount: state.hintCount,
      durationMs,
    }).then((result) => {
      setState((prev) => ({ ...prev, completed: true, selectedIndex: null }));
      if (result.share) setShare(result.share);
      if (result.traceId) setTraceId(result.traceId);
      const next = result.streak
        ? {
            currentCount: result.streak.currentCount,
            longestCount: result.streak.longestCount,
            lastCompletedDay: result.streak.lastCompletedDay,
          }
        : applyLocalStreakDay(loadLocalStreak(), puzzle.publicationDay);
      saveLocalStreak(next);
      setStreak(next);
    });
  }, [puzzle, state]);

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
        moves: prev.moves + 1,
      };
    });
  }

  function undo(): void {
    setState((prev) => {
      if (prev.history.length === 0 || prev.completed) return prev;
      const history = [...prev.history];
      const order = history.pop()!;
      return {
        ...prev,
        order,
        history,
        selectedIndex: null,
        moves: Math.max(0, prev.moves - 1),
      };
    });
  }

  function reset(): void {
    completingRef.current = false;
    setShare(null);
    setState({
      order: [...puzzle.initialOrder],
      selectedIndex: null,
      history: [],
      completed: false,
      clientAttemptId: crypto.randomUUID().replaceAll("-", ""),
      attemptId: null,
      moves: 0,
      hintCount: 0,
      startedAtMs: Date.now(),
    });
    setHint(null);
  }

  async function onHint(): Promise<void> {
    if (!state.attemptId || state.completed) return;
    const result = await requestHint({
      attemptId: state.attemptId,
      currentOrder: state.order,
    });
    setHint(result.message);
    setState((prev) => ({ ...prev, hintCount: result.hintCount }));
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
        <button
          type="button"
          onClick={undo}
          disabled={state.history.length === 0 || state.completed}
        >
          Undo
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={() => void onHint()} disabled={state.completed}>
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

      <p className="meta" data-testid="streak-display">
        Streak: {streak.currentCount} (best {streak.longestCount})
      </p>

      {state.completed ? (
        <div className="complete" data-testid="completion">
          <h2>Ta-da-ding!</h2>
          <p>Your daily tiny win is complete.</p>
          {share ? (
            <div data-testid="share-card">
              <p className="meta">{share.text}</p>
              <button
                type="button"
                className="primary-cta"
                onClick={() => {
                  void navigator.clipboard?.writeText(share.text);
                }}
              >
                Copy spoiler-free share
              </button>
            </div>
          ) : null}
          {traceId ? (
            <p className="meta" data-testid="trace-id">
              Trace: {traceId}
            </p>
          ) : null}
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
