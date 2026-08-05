import { createDb, inboxEvents, outboxEvents } from "@tadading/db";
import { eventEnvelopeSchema } from "@tadading/events";
import { createLogger } from "@tadading/observability";
import { Queue, Worker } from "bullmq";
import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";
import { Redis } from "ioredis";

const QUEUE_NAME = "outbox";
const CONSUMER = "metrics";

export async function startOutboxDispatcher(input: {
  databaseUrl: string;
  redisUrl: string;
  environment: string;
}): Promise<{ stop: () => Promise<void> }> {
  const logger = createLogger({
    service: "worker",
    environment: input.environment,
  });

  const connection = new Redis(input.redisUrl, {
    maxRetriesPerRequest: null,
  });

  const queue = new Queue(QUEUE_NAME, { connection });

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const eventId = String(job.data.eventId);
      const { db, sql: pg } = createDb(input.databaseUrl);
      try {
        const rows = await db
          .select()
          .from(outboxEvents)
          .where(eq(outboxEvents.id, eventId))
          .limit(1);
        const row = rows[0];
        if (!row) return;
        if (row.dispatchedAt) return;

        const envelope = eventEnvelopeSchema.parse(row.payload);
        await db.transaction(async (tx) => {
          await tx
            .insert(inboxEvents)
            .values({
              consumer: CONSUMER,
              eventId: envelope.id,
              processedAt: new Date(),
            })
            .onConflictDoNothing();

          await tx
            .update(outboxEvents)
            .set({
              dispatchedAt: new Date(),
              attempts: sql`${outboxEvents.attempts} + 1`,
              lastError: null,
            })
            .where(eq(outboxEvents.id, eventId));
        });

        logger.log({
          message: "outbox_event_dispatched",
          eventId: envelope.id,
          eventType: envelope.type,
          ...(envelope.traceId ? { traceId: envelope.traceId } : {}),
        });
      } finally {
        await pg.end({ timeout: 5 });
      }
    },
    {
      connection,
      concurrency: 2,
    },
  );

  worker.on("failed", (job, error) => {
    logger.log({
      level: "error",
      message: "outbox_job_failed",
      eventId: job?.data?.eventId,
      error: error.message,
    });
  });

  const poll = async (): Promise<void> => {
    const { db, sql: pg } = createDb(input.databaseUrl);
    try {
      const pending = await db
        .select()
        .from(outboxEvents)
        .where(
          and(
            isNull(outboxEvents.dispatchedAt),
            lte(outboxEvents.availableAt, new Date()),
          ),
        )
        .orderBy(asc(outboxEvents.availableAt))
        .limit(50);

      for (const event of pending) {
        await queue.add(
          "dispatch",
          { eventId: event.id },
          {
            jobId: event.id,
            attempts: 5,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: 1000,
            removeOnFail: 5000,
          },
        );
      }
    } finally {
      await pg.end({ timeout: 5 });
    }
  };

  await poll();
  const timer = setInterval(() => {
    void poll();
  }, 2000);

  return {
    async stop() {
      clearInterval(timer);
      await worker.close();
      await queue.close();
      connection.disconnect();
    },
  };
}
