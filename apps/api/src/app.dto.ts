import { ApiProperty } from '@nestjs/swagger';
import { API_VERSION, type HealthResponse } from '@repo/shared';

export class HealthResponseDto implements HealthResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ example: API_VERSION })
  version: typeof API_VERSION;

  @ApiProperty({ example: '2026-05-24T12:00:00.000Z' })
  timestamp: string;
}
