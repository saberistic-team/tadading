export type GuestStreak = {
  currentCount: number;
  longestCount: number;
  lastCompletedDay: string | null;
};

/** Calendar-day streak update in UTC (YYYY-MM-DD). */
export function nextGuestStreak(
  previous: GuestStreak | null,
  completedDay: string,
): GuestStreak {
  if (!previous || !previous.lastCompletedDay) {
    return {
      currentCount: 1,
      longestCount: 1,
      lastCompletedDay: completedDay,
    };
  }

  if (previous.lastCompletedDay === completedDay) {
    return previous;
  }

  const prev = parseDay(previous.lastCompletedDay);
  const curr = parseDay(completedDay);
  const diffDays = Math.round((curr - prev) / 86_400_000);
  const currentCount = diffDays === 1 ? previous.currentCount + 1 : 1;
  return {
    currentCount,
    longestCount: Math.max(previous.longestCount, currentCount),
    lastCompletedDay: completedDay,
  };
}

function parseDay(day: string): number {
  return Date.parse(`${day}T00:00:00.000Z`);
}
