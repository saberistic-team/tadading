import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadServerEnv, toPublicBrand } from "@tadading/config";
import { createLogger, initTelemetry } from "@tadading/observability";
import { AppModule } from "./app.module.js";

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

  await app.listen(env.PORT);
  logger.log({
    message: "worker_listening",
    port: env.PORT,
    brand: brand.brandName,
    note: "Phase 0 worker exposes health only; BullMQ/Temporal arrive later",
  });
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
