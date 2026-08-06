import type { PublicPuzzleDto } from "@tadading/contracts";

const boardKey = (puzzleId: string) => `tadading.board.${puzzleId}`;

export type BoardState = {
  order: string[];
  selectedIndex: number | null;
  history: string[][];
  completed: boolean;
  clientAttemptId: string;
  attemptId: string | null;
  moves: number;
  hintCount: number;
  startedAtMs: number;
};

function newClientAttemptId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function loadBoard(puzzle: PublicPuzzleDto): BoardState {
  const fresh = (): BoardState => ({
    order: [...puzzle.initialOrder],
    selectedIndex: null,
    history: [],
    completed: false,
    clientAttemptId: newClientAttemptId(),
    attemptId: null,
    moves: 0,
    hintCount: 0,
    startedAtMs: Date.now(),
  });

  if (typeof window === "undefined") return fresh();

  try {
    const raw = window.localStorage.getItem(boardKey(puzzle.id));
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as BoardState;
    if (!Array.isArray(parsed.order) || parsed.order.length !== 8) {
      throw new Error("bad board");
    }
    return {
      order: parsed.order,
      selectedIndex: null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      completed: Boolean(parsed.completed),
      clientAttemptId: parsed.clientAttemptId || newClientAttemptId(),
      attemptId: parsed.attemptId ?? null,
      moves: parsed.moves ?? 0,
      hintCount: parsed.hintCount ?? 0,
      startedAtMs: parsed.startedAtMs ?? Date.now(),
    };
  } catch {
    return fresh();
  }
}

export function saveBoard(puzzleId: string, state: BoardState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    boardKey(puzzleId),
    JSON.stringify({
      order: state.order,
      history: state.history.slice(-40),
      completed: state.completed,
      clientAttemptId: state.clientAttemptId,
      attemptId: state.attemptId,
      moves: state.moves,
      hintCount: state.hintCount,
      startedAtMs: state.startedAtMs,
    }),
  );
}

export function swapIndices(order: string[], a: number, b: number): string[] {
  const next = [...order];
  const tmp = next[a]!;
  next[a] = next[b]!;
  next[b] = tmp;
  return next;
}
