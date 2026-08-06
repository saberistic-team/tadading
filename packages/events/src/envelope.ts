import { z } from "zod";

export const eventEnvelopeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  version: z.number().int().positive(),
  occurredAt: z.string().datetime(),
  aggregate: z.object({
    type: z.string().min(1),
    id: z.string().min(1),
  }),
  traceId: z.string().min(1).optional(),
  payload: z.unknown(),
});

export type EventEnvelope = z.infer<typeof eventEnvelopeSchema>;

export function createEnvelope(input: {
  id: string;
  type: string;
  version: number;
  aggregateType: string;
  aggregateId: string;
  payload: unknown;
  traceId?: string;
  occurredAt?: Date;
}): EventEnvelope {
  return eventEnvelopeSchema.parse({
    id: input.id,
    type: input.type,
    version: input.version,
    occurredAt: (input.occurredAt ?? new Date()).toISOString(),
    aggregate: {
      type: input.aggregateType,
      id: input.aggregateId,
    },
    ...(input.traceId ? { traceId: input.traceId } : {}),
    payload: input.payload,
  });
}
