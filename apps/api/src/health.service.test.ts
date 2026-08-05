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
    const service = new HealthService("api", "postgres://x", "redis://x");
    const live = service.live();
    expect(live.status).toBe("live");
    expect(live.service).toBe("api");
  });

  it("returns ready when dependencies are up", async () => {
    const service = new HealthService("api", "postgres://x", "redis://x");
    const ready = await service.ready();
    expect(ready.status).toBe("ready");
    expect(ready.dependencies).toHaveLength(2);
  });
});
