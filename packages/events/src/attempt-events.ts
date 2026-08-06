import { z } from "zod";

export const attemptStartedPayloadSchema = z.object({
  attemptId: z.string().min(1),
  puzzleId: z.string().min(1),
  guestIdHash: z.string().min(1).nullable(),
  clientAttemptId: z.string().min(1),
  publicationDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const attemptStateSavedPayloadSchema = z.object({
  attemptId: z.string().min(1),
  puzzleId: z.string().min(1),
  moves: z.number().int().nonnegative(),
  hintCount: z.number().int().nonnegative(),
});

export const puzzleCompletedPayloadSchema = z.object({
  attemptId: z.string().min(1),
  puzzleId: z.string().min(1),
  guestIdHash: z.string().min(1).nullable(),
  publicationDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moves: z.number().int().nonnegative(),
  hintCount: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
  shareCode: z.string().min(1),
});

export const streakUpdatedPayloadSchema = z.object({
  guestIdHash: z.string().min(1),
  currentCount: z.number().int().nonnegative(),
  longestCount: z.number().int().nonnegative(),
  lastCompletedDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const EVENT_TYPES = {
  attemptStarted: "attempt.started.v1",
  attemptStateSaved: "attempt.state-saved.v1",
  puzzleCompleted: "puzzle.completed.v1",
  streakUpdated: "streak.updated.v1",
} as const;
