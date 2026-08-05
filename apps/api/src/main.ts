import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { loadServerEnv, toPublicBrand } from "@tadading/config";
import { runMigrations } from "@tadading/db";
import { createLogger, initTelemetry } from "@tadading/observability";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const env = loadServerEnv({
    ...process.env,
    SERVICE_NAME: process.env.SERVICE_NAME ?? "api",
  });
  const brand = toPublicBrand(env);
  initTelemetry(env.SERVICE_NAME);
  const logger = createLogger({
    service: env.SERVICE_NAME,
    environment: env.NODE_ENV,
  });

  // Free-tier Render does not support preDeployCommand; migrate on boot instead.
  const migrationsFolder = await runMigrations(env.DATABASE_URL);
  logger.log({ message: "migrations_applied", migrationsFolder });

  const app = await NestFactory.create(AppModule.register(env, brand), {
    logger: false,
  });
  app.enableShutdownHooks();
  app.enableCors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "X-TadaDing-Guest-Id"],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${brand.brandName} API`)
    .setDescription("TadaDing HTTP API")
    .setVersion("0.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const http = app.getHttpAdapter().getInstance() as {
    get: (path: string, handler: (req: unknown, res: { json: (body: unknown) => void }) => void) => void;
  };
  http.get("/openapi.json", (_req, res) => {
    res.json(document);
  });

  await app.listen(env.PORT);
  logger.log({
    message: "api_listening",
    port: env.PORT,
    brand: brand.brandName,
    publicDomain: brand.publicDomain,
  });
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
