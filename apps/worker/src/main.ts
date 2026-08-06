import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadServerEnv, toPublicBrand } from "@tadading/config";
import { createLogger, initTelemetry } from "@tadading/observability";
import { AppModule } from "./app.module.js";
import { startOutboxDispatcher } from "./outbox-dispatcher.js";

async function bootstrap(): Promise<void> {
  const env = loadServerEnv({
    ...process.env,
    SERVICE_NAME: process.env.SERVICE_NAME ?? "worker",
    PORT: process.env.PORT ?? process.env.HEALTH_PORT ?? "3102",
  });
  const brand = toPublicBrand(env);
  initTelemetry(env.SERVICE_NAME);
  const logger = createLogger({
    service: env.SERVICE_NAME,
    environment: env.NODE_ENV,
  });

  const app = await NestFactory.create(AppModule.register(env), {
    logger: false,
  });
  app.enableShutdownHooks();

  const dispatcher = await startOutboxDispatcher({
    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    environment: env.NODE_ENV,
  });

  app.enableShutdownHooks();
  await app.listen(env.PORT);

  logger.log({
    message: "worker_listening",
    port: env.PORT,
    brand: brand.brandName,
    note: "BullMQ outbox dispatcher active",
  });

  const shutdown = async (): Promise<void> => {
    await dispatcher.stop();
    await app.close();
  };

  process.on("SIGTERM", () => {
    void shutdown();
  });
  process.on("SIGINT", () => {
    void shutdown();
  });
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
