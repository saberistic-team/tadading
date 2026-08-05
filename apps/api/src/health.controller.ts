import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { HealthService } from "./health.service.js";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get("live")
  live() {
    return this.health.live();
  }

  @Get("ready")
  async ready(@Res({ passthrough: true }) res: Response) {
    const body = await this.health.ready();
    res.status(body.status === "ready" ? 200 : 503);
    return body;
  }
}
