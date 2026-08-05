import { Injectable } from "@nestjs/common";
import type {
  HealthLiveResponse,
  HealthReadyResponse,
} from "@tadading/contracts";
import { pingPostgres } from "@tadading/db";
import { pingRedis } from "./redis.js";

@Injectable()
export class HealthService {
  constructor(
    private readonly serviceName: string,
    private readonly databaseUrl: string,
    private readonly redisUrl: string,
  ) {}

  live(): HealthLiveResponse {
    return {
      status: "live",
      service: this.serviceName,
      timestamp: new Date().toISOString(),
    };
  }

  async ready(): Promise<HealthReadyResponse> {
    const dependencies: HealthReadyResponse["dependencies"] = [];

    try {
      const latencyMs = await pingPostgres(this.databaseUrl);
      dependencies.push({ name: "postgres", status: "up", latencyMs });
    } catch (error) {
      dependencies.push({
        name: "postgres",
        status: "down",
        error: error instanceof Error ? error.message : "unknown",
      });
    }

    try {
      const latencyMs = await pingRedis(this.redisUrl);
      dependencies.push({ name: "redis", status: "up", latencyMs });
    } catch (error) {
      dependencies.push({
        name: "redis",
        status: "down",
        error: error instanceof Error ? error.message : "unknown",
      });
    }

    const ready = dependencies.every((d) => d.status === "up");
    return {
      status: ready ? "ready" : "not_ready",
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      dependencies,
    };
  }
}
