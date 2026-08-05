import { describe, expect, it, vi } from "vitest";
import { createLogger } from "./index.js";

describe("createLogger", () => {
  it("emits structured JSON", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const logger = createLogger({ service: "api", environment: "test" });
    logger.log({ message: "hello" });
    expect(spy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(spy.mock.calls[0]?.[0])) as {
      message: string;
      service: string;
    };
    expect(payload.message).toBe("hello");
    expect(payload.service).toBe("api");
    spy.mockRestore();
  });
});
