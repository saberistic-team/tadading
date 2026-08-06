import { describe, expect, it } from "vitest";
import { nextGuestStreak } from "./streaks.js";

describe("nextGuestStreak", () => {
  it("starts at 1", () => {
    expect(nextGuestStreak(null, "2026-08-05")).toEqual({
      currentCount: 1,
      longestCount: 1,
      lastCompletedDay: "2026-08-05",
    });
  });

  it("increments consecutive days", () => {
    const next = nextGuestStreak(
      {
        currentCount: 2,
        longestCount: 2,
        lastCompletedDay: "2026-08-04",
      },
      "2026-08-05",
    );
    expect(next.currentCount).toBe(3);
    expect(next.longestCount).toBe(3);
  });

  it("is idempotent for the same day", () => {
    const prev = {
      currentCount: 3,
      longestCount: 5,
      lastCompletedDay: "2026-08-05",
    };
    expect(nextGuestStreak(prev, "2026-08-05")).toEqual(prev);
  });

  it("resets after a gap", () => {
    const next = nextGuestStreak(
      {
        currentCount: 4,
        longestCount: 4,
        lastCompletedDay: "2026-08-01",
      },
      "2026-08-05",
    );
    expect(next.currentCount).toBe(1);
    expect(next.longestCount).toBe(4);
  });
});
