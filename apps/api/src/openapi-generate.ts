import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "node:fs";
import { loadServerEnv, toPublicBrand } from "@tadading/config";
import { AppModule } from "./app.module.js";

async function main(): Promise<void> {
  const env = loadServerEnv({
    SERVICE_NAME: "api",
    DATABASE_URL: "postgres://tadading:tadading@localhost:5433/tadading",
    REDIS_URL: "redis://localhost:6380",
    NODE_ENV: "development",
  });
  const brand = toPublicBrand(env);
  const app = await NestFactory.create(AppModule.register(env, brand), {
    logger: false,
  });
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(`${brand.brandName} API`)
      .setVersion("0.0.0")
      .build(),
  );
  writeFileSync(
    new URL("../../../docs/api/openapi.snapshot.json", import.meta.url),
    `${JSON.stringify(document, null, 2)}\n`,
  );
  await app.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
