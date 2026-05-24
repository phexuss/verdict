import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthResponse } from '@repo/shared';
import { HealthResponseDto } from './app.dto.js';
import { AppService } from './app.service.js';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get API health',
    operationId: 'getHealth',
  })
  @ApiOkResponse({
    description: 'API is running.',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }
}
