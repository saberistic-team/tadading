import { DynamicModule, Module } from "@nestjs/common";
import type { PublicBrand, ServerEnv } from "@tadading/config";
import { BrandController } from "./brand.controller.js";
import { HealthController } from "./health.controller.js";
import { HealthService } from "./health.service.js";
import { PuzzlesController } from "./puzzles.controller.js";
import { PuzzlesService } from "./puzzles.service.js";
import { GUEST_HMAC_SECRET, PUBLIC_BRAND, SERVER_ENV } from "./tokens.js";

@Module({})
export class AppModule {
  static register(env: ServerEnv, brand: PublicBrand): DynamicModule {
    return {
      module: AppModule,
      controllers: [HealthController, BrandController, PuzzlesController],
      providers: [
        { provide: SERVER_ENV, useValue: env },
        { provide: PUBLIC_BRAND, useValue: brand },
        { provide: GUEST_HMAC_SECRET, useValue: env.GUEST_HMAC_SECRET },
        {
          provide: HealthService,
          useFactory: () =>
            new HealthService(
              env.SERVICE_NAME,
              env.DATABASE_URL,
              env.REDIS_URL,
            ),
        },
        {
          provide: PuzzlesService,
          useFactory: () => new PuzzlesService(env.DATABASE_URL),
        },
      ],
    };
  }
}
