import { DynamicModule, Module } from "@nestjs/common";
import type { PublicBrand, ServerEnv } from "@tadading/config";
import { BrandController } from "./brand.controller.js";
import { HealthController } from "./health.controller.js";
import { HealthService } from "./health.service.js";
import { PUBLIC_BRAND, SERVER_ENV } from "./tokens.js";

@Module({})
export class AppModule {
  static register(env: ServerEnv, brand: PublicBrand): DynamicModule {
    return {
      module: AppModule,
      controllers: [HealthController, BrandController],
      providers: [
        { provide: SERVER_ENV, useValue: env },
        { provide: PUBLIC_BRAND, useValue: brand },
        {
          provide: HealthService,
          useFactory: () =>
            new HealthService(
              env.SERVICE_NAME,
              env.DATABASE_URL,
              env.REDIS_URL,
            ),
        },
      ],
    };
  }
}
