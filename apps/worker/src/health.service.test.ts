import { describe, expect, it, vi } from "vitest";
import { HealthService } from "./health.service.js";

vi.mock("@tadading/db", () => ({
  pingPostgres: vi.fn(async () => 1),
}));

vi.mock("./redis.js", () => ({
  pingRedis: vi.fn(async () => 2),
}));

describe("HealthService", () => {
  it("returns live status", () => {
    const service = new HealthService("worker", "postgres://x", "redis://x");
    expect(service.live().status).toBe("live");
  });
});
