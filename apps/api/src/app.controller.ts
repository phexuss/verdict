import { Controller, Get, Inject } from "@nestjs/common";
import type { HealthResponse } from "@repo/shared";
import { AppService } from "./app.service";

@Controller("health")
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }
}
