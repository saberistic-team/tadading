import { describe, expect, it } from "vitest";
import { createEnvelope, eventEnvelopeSchema } from "./envelope.js";

describe("event envelope", () => {
  it("validates a created envelope", () => {
    const envelope = createEnvelope({
      id: "evt_1",
      type: "attempt.started.v1",
      version: 1,
      aggregateType: "puzzle_attempt",
      aggregateId: "att_1",
      payload: { attemptId: "att_1" },
      traceId: "trace_1",
    });
    expect(eventEnvelopeSchema.parse(envelope).traceId).toBe("trace_1");
  });
});
