import type { PublicPuzzleDto } from "@tadading/contracts";
import { getOrCreateGuestId } from "./guest";

function apiOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    process.env.API_ORIGIN ??
    "http://localhost:3101"
  );
}

export async function fetchTodayPuzzle(): Promise<PublicPuzzleDto> {
  const guestId = getOrCreateGuestId();
  const response = await fetch(`${apiOrigin()}/v1/puzzles/today`, {
    headers: {
      "X-TadaDing-Guest-Id": guestId,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load today's puzzle (${response.status})`);
  }
  return (await response.json()) as PublicPuzzleDto;
}

export async function completePuzzle(
  puzzleId: string,
  order: string[],
): Promise<{ ok: boolean; reason?: string }> {
  const response = await fetch(
    `${apiOrigin()}/v1/puzzles/${encodeURIComponent(puzzleId)}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TadaDing-Guest-Id": getOrCreateGuestId(),
      },
      body: JSON.stringify({ order }),
    },
  );
  return (await response.json()) as { ok: boolean; reason?: string };
}
