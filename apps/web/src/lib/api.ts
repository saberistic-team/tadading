import type {
  AttemptResponse,
  CompleteAttemptResponse,
  PublicPuzzleDto,
} from "@tadading/contracts";
import { getOrCreateGuestId } from "./guest";

function apiOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    process.env.API_ORIGIN ??
    "http://127.0.0.1:3101"
  );
}

function guestHeaders(json = false): HeadersInit {
  const headers: Record<string, string> = {
    "X-TadaDing-Guest-Id": getOrCreateGuestId(),
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export async function fetchTodayPuzzle(): Promise<PublicPuzzleDto> {
  const response = await fetch(`${apiOrigin()}/v1/puzzles/today`, {
    headers: guestHeaders(),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load today's puzzle (${response.status})`);
  }
  return (await response.json()) as PublicPuzzleDto;
}

export async function startAttempt(input: {
  puzzleId: string;
  clientAttemptId: string;
  initialOrder: string[];
}): Promise<AttemptResponse> {
  const response = await fetch(
    `${apiOrigin()}/v1/puzzles/${encodeURIComponent(input.puzzleId)}/attempts`,
    {
      method: "POST",
      headers: guestHeaders(true),
      body: JSON.stringify({
        clientAttemptId: input.clientAttemptId,
        clientVersion: "web-1",
        initialOrder: input.initialOrder,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to start attempt (${response.status})`);
  }
  return (await response.json()) as AttemptResponse;
}

export async function saveAttemptState(input: {
  attemptId: string;
  currentOrder: string[];
  moves: number;
  hintCount: number;
}): Promise<AttemptResponse> {
  const response = await fetch(
    `${apiOrigin()}/v1/attempts/${encodeURIComponent(input.attemptId)}/state`,
    {
      method: "PUT",
      headers: guestHeaders(true),
      body: JSON.stringify({
        currentOrder: input.currentOrder,
        moves: input.moves,
        hintCount: input.hintCount,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to save attempt (${response.status})`);
  }
  return (await response.json()) as AttemptResponse;
}

export async function completeAttempt(input: {
  attemptId: string;
  order: string[];
  moves: number;
  hintCount: number;
  durationMs: number;
}): Promise<CompleteAttemptResponse> {
  const response = await fetch(
    `${apiOrigin()}/v1/attempts/${encodeURIComponent(input.attemptId)}/complete`,
    {
      method: "POST",
      headers: guestHeaders(true),
      body: JSON.stringify(input),
    },
  );
  return (await response.json()) as CompleteAttemptResponse;
}

export async function requestHint(input: {
  attemptId: string;
  currentOrder: string[];
}): Promise<{ message: string; hintCount: number; edgeIndex: number | null }> {
  const response = await fetch(
    `${apiOrigin()}/v1/attempts/${encodeURIComponent(input.attemptId)}/hint`,
    {
      method: "POST",
      headers: guestHeaders(true),
      body: JSON.stringify({ currentOrder: input.currentOrder }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to request hint (${response.status})`);
  }
  return (await response.json()) as {
    message: string;
    hintCount: number;
    edgeIndex: number | null;
  };
}

/** @deprecated Phase 1 helper — prefer completeAttempt */
export async function completePuzzle(
  puzzleId: string,
  order: string[],
): Promise<{ ok: boolean; reason?: string }> {
  const response = await fetch(
    `${apiOrigin()}/v1/puzzles/${encodeURIComponent(puzzleId)}/complete`,
    {
      method: "POST",
      headers: guestHeaders(true),
      body: JSON.stringify({ order }),
    },
  );
  return (await response.json()) as { ok: boolean; reason?: string };
}
