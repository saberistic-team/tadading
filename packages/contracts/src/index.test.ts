import { describe, expect, it } from "vitest";
import {
  healthLiveResponseSchema,
  healthReadyResponseSchema,
} from "./index.js";

describe("health contracts", () => {
  it("accepts a live response", () => {
    const parsed = healthLiveResponseSchema.parse({
      status: "live",
      service: "api",
      timestamp: new Date().toISOString(),
    });
    expect(parsed.status).toBe("live");
  });

  it("accepts a ready response with dependencies", () => {
    const parsed = healthReadyResponseSchema.parse({
      status: "ready",
      service: "api",
      timestamp: new Date().toISOString(),
      dependencies: [
        { name: "postgres", status: "up", latencyMs: 2 },
        { name: "redis", status: "up", latencyMs: 1 },
      ],
    });
    expect(parsed.dependencies).toHaveLength(2);
  });
});
