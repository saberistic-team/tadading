import type { EventEnvelope } from "@tadading/events";
import type { Database } from "./client.js";
import { outboxEvents } from "./schema.js";

type DbOrTx =
  | Database["db"]
  | Parameters<Parameters<Database["db"]["transaction"]>[0]>[0];

export async function insertOutboxEvent(
  db: DbOrTx,
  envelope: EventEnvelope,
): Promise<void> {
  await db.insert(outboxEvents).values({
    id: envelope.id,
    aggregateType: envelope.aggregate.type,
    aggregateId: envelope.aggregate.id,
    eventType: envelope.type,
    eventVersion: envelope.version,
    payload: {
      ...envelope,
    },
    traceId: envelope.traceId ?? null,
    occurredAt: new Date(envelope.occurredAt),
    availableAt: new Date(envelope.occurredAt),
    attempts: 0,
  });
}
