import { DynamicModule, Module } from "@nestjs/common";
import type { ServerEnv } from "@tadading/config";
import { HealthController } from "./health.controller.js";
import { HealthService } from "./health.service.js";

@Module({})
export class AppModule {
  static register(env: ServerEnv): DynamicModule {
    return {
      module: AppModule,
      controllers: [HealthController],
      providers: [
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
