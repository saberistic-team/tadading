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

