import { z } from "zod";

export const healthLiveResponseSchema = z.object({
  status: z.literal("live"),
  service: z.string().min(1),
  timestamp: z.string().datetime(),
});

export type HealthLiveResponse = z.infer<typeof healthLiveResponseSchema>;

export const dependencyStatusSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["up", "down"]),
  latencyMs: z.number().nonnegative().optional(),
  error: z.string().optional(),
});

export const healthReadyResponseSchema = z.object({
  status: z.enum(["ready", "not_ready"]),
  service: z.string().min(1),
  timestamp: z.string().datetime(),
  dependencies: z.array(dependencyStatusSchema),
});

export type HealthReadyResponse = z.infer<typeof healthReadyResponseSchema>;

export const brandPublicResponseSchema = z.object({
  brandName: z.string().min(1),
  publicDomain: z.string().min(1),
  socialHandle: z.string().min(1),
  tagline: z.string().min(1),
});

export type BrandPublicResponse = z.infer<typeof brandPublicResponseSchema>;

export const tileSchema = z.object({
  id: z.string().min(1),
  shape: z.enum(["circle", "triangle", "square", "star"]),
  color: z.enum(["coral", "teal", "gold", "violet"]),
  fill: z.enum(["solid", "striped"]),
  count: z.union([z.literal(1), z.literal(2)]),
});

export const publicPuzzleSchema = z.object({
  id: z.string().min(1),
  publicationDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generatorVersion: z.string().min(1),
  difficulty: z.enum(["easy", "standard", "tricky"]),
  tiles: z.array(tileSchema).length(8),
  initialOrder: z.array(z.string().min(1)).length(8),
  difficultyScore: z.number().int().min(1).max(100),
});

export type PublicPuzzleDto = z.infer<typeof publicPuzzleSchema>;

export const completePuzzleRequestSchema = z.object({
  order: z.array(z.string().min(1)).length(8),
});

export const completePuzzleResponseSchema = z.object({
  ok: z.boolean(),
  reason: z.string().optional(),
});

export const startAttemptRequestSchema = z.object({
  clientAttemptId: z.string().min(8).max(128),
  clientVersion: z.string().min(1).max(64).default("web-1"),
  initialOrder: z.array(z.string().min(1)).length(8),
});

export const attemptResponseSchema = z.object({
  id: z.string().min(1),
  puzzleId: z.string().min(1),
  clientAttemptId: z.string().min(1),
  currentOrder: z.array(z.string()).nullable(),
  moves: z.number().int().nonnegative(),
  hintCount: z.number().int().nonnegative(),
  completedAt: z.string().datetime().nullable(),
  shareCode: z.string().nullable(),
  traceId: z.string().nullable(),
});

export type AttemptResponse = z.infer<typeof attemptResponseSchema>;

export const saveAttemptStateRequestSchema = z.object({
  currentOrder: z.array(z.string().min(1)).length(8),
  moves: z.number().int().nonnegative(),
  hintCount: z.number().int().nonnegative().optional(),
});

export const completeAttemptRequestSchema = z.object({
  order: z.array(z.string().min(1)).length(8),
  moves: z.number().int().nonnegative(),
  hintCount: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
});

export const completeAttemptResponseSchema = z.object({
  ok: z.boolean(),
  reason: z.string().optional(),
  attemptId: z.string().optional(),
  share: z
    .object({
      code: z.string(),
      text: z.string(),
      moves: z.number().int(),
      durationMs: z.number().int(),
      day: z.string(),
    })
    .optional(),
  streak: z
    .object({
      currentCount: z.number().int(),
      longestCount: z.number().int(),
      lastCompletedDay: z.string().nullable(),
    })
    .optional(),
  eventIds: z.array(z.string()).optional(),
  traceId: z.string().optional(),
});

export type CompleteAttemptResponse = z.infer<
  typeof completeAttemptResponseSchema
>;

export const hintRequestSchema = z.object({
  currentOrder: z.array(z.string().min(1)).length(8),
});

export const hintResponseSchema = z.object({
  message: z.string(),
  hintCount: z.number().int().nonnegative(),
  edgeIndex: z.number().int().min(0).max(7).nullable(),
});

