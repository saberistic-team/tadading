import { Redis } from "ioredis";

export async function pingRedis(redisUrl: string): Promise<number> {
  const started = Date.now();
  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    connectTimeout: 5_000,
  });
  try {
    await redis.connect();
    const pong = await redis.ping();
    if (pong !== "PONG") {
      throw new Error(`Unexpected Redis ping response: ${pong}`);
    }
    return Date.now() - started;
  } finally {
    redis.disconnect();
  }
}
