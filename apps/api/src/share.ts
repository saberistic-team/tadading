import { createHash } from "node:crypto";

/** Spoiler-free share code — no tile order or solution. */
export function buildShareResult(input: {
  attemptId: string;
  publicationDay: string;
  moves: number;
  durationMs: number;
}): { code: string; text: string } {
  const code = createHash("sha256")
    .update(`${input.attemptId}:${input.publicationDay}`)
    .digest("hex")
    .slice(0, 8);

  const seconds = Math.max(1, Math.round(input.durationMs / 1000));
  const text = `TadaDing ${input.publicationDay}: closed the ring in ${input.moves} moves / ${seconds}s. #TadaDing`;

  return { code, text };
}
