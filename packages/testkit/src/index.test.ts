import { describe, expect, it } from "vitest";
import { createFixedClock, foundationServerEnv } from "./index.js";

describe("testkit", () => {
  it("returns a fixed clock", () => {
    const clock = createFixedClock("2026-08-04T12:00:00.000Z");
    expect(clock.now().toISOString()).toBe("2026-08-04T12:00:00.000Z");
  });

  it("builds foundation env defaults", () => {
    expect(foundationServerEnv().SERVICE_NAME).toBe("test");
  });
});
