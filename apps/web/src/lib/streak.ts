const KEY = "tadading.localStreak";

export type LocalStreak = {
  currentCount: number;
  longestCount: number;
  lastCompletedDay: string | null;
};

export function loadLocalStreak(): LocalStreak {
  if (typeof window === "undefined") {
    return { currentCount: 0, longestCount: 0, lastCompletedDay: null };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return { currentCount: 0, longestCount: 0, lastCompletedDay: null };
    }
    return JSON.parse(raw) as LocalStreak;
  } catch {
    return { currentCount: 0, longestCount: 0, lastCompletedDay: null };
  }
}

export function saveLocalStreak(streak: LocalStreak): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(streak));
}

export function applyLocalStreakDay(
  previous: LocalStreak,
  completedDay: string,
): LocalStreak {
  if (!previous.lastCompletedDay) {
    return {
      currentCount: 1,
      longestCount: Math.max(1, previous.longestCount),
      lastCompletedDay: completedDay,
    };
  }
  if (previous.lastCompletedDay === completedDay) return previous;
  const prev = Date.parse(`${previous.lastCompletedDay}T00:00:00.000Z`);
  const curr = Date.parse(`${completedDay}T00:00:00.000Z`);
  const diff = Math.round((curr - prev) / 86_400_000);
  const currentCount = diff === 1 ? previous.currentCount + 1 : 1;
  return {
    currentCount,
    longestCount: Math.max(previous.longestCount, currentCount),
    lastCompletedDay: completedDay,
  };
}
