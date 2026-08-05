import type { Clock } from "@tadading/domain";

export function createFixedClock(iso: string): Clock {
  const fixed = new Date(iso);
  return {
    now(): Date {
      return new Date(fixed.getTime());
    },
  };
}

export function foundationServerEnv(
  overrides: Record<string, string> = {},
): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "test",
    SERVICE_NAME: "test",
    BRAND_NAME: "TadaDing",
    PUBLIC_DOMAIN: "localhost",
    SOCIAL_HANDLE: "playtadading",
    TAGLINE: "Your daily tiny win.",
    WEB_ORIGIN: "http://localhost:3100",
    API_ORIGIN: "http://localhost:3101",
    DATABASE_URL: "postgres://tadading:tadading@localhost:5433/tadading",
    REDIS_URL: "redis://localhost:6380",
    PORT: "3101",
    ...overrides,
  };
}
