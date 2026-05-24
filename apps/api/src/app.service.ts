import { Injectable } from '@nestjs/common';
import { API_VERSION, type HealthResponse } from '@repo/shared';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      version: API_VERSION,
      timestamp: new Date().toISOString(),
    };
  }
}
