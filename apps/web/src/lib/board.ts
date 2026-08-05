import type { PublicPuzzleDto } from "@tadading/contracts";

const boardKey = (puzzleId: string) => `tadading.board.${puzzleId}`;

export type BoardState = {
  order: string[];
  selectedIndex: number | null;
  history: string[][];
  completed: boolean;
};

export function loadBoard(puzzle: PublicPuzzleDto): BoardState {
  if (typeof window === "undefined") {
    return {
      order: [...puzzle.initialOrder],
      selectedIndex: null,
      history: [],
      completed: false,
    };
  }
  try {
    const raw = window.localStorage.getItem(boardKey(puzzle.id));
    if (!raw) {
      return {
        order: [...puzzle.initialOrder],
        selectedIndex: null,
        history: [],
        completed: false,
      };
    }
    const parsed = JSON.parse(raw) as BoardState;
    if (!Array.isArray(parsed.order) || parsed.order.length !== 8) {
      throw new Error("bad board");
    }
    return {
      order: parsed.order,
      selectedIndex: null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      completed: Boolean(parsed.completed),
    };
  } catch {
    return {
      order: [...puzzle.initialOrder],
      selectedIndex: null,
      history: [],
      completed: false,
    };
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
