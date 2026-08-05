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
