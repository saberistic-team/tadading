import { describe, expect, it } from "vitest";
import { asEntityId, createEntityId, err, isEntityId, ok } from "./index.js";

describe("Result", () => {
  it("creates ok and err variants", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
    expect(err("x")).toEqual({ ok: false, error: "x" });
  });
});

describe("EntityId", () => {
  it("generates a valid EntityId", () => {
    const id = createEntityId();
    expect(isEntityId(id)).toBe(true);
    expect(asEntityId(id)).toBe(id);
  });
});
