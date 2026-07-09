import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class GenerateAiReviewDto {
  @ApiProperty({
    example: 'en',
    enum: ['en', 'ru'],
  })
  @IsIn(['en', 'ru'])
  locale!: 'en' | 'ru';
}

export class AiReviewResponseDto {
  @ApiProperty({ example: 'Perfect for viewers who enjoy...' })
  aiSummary!: string;

  @ApiProperty({ example: 'A dark, brooding atmosphere with...' })
  aiAnalysis!: string;

  @ApiProperty({ example: 'A must-watch for fans of...' })
  aiVerdict!: string;

  @ApiProperty({ example: 'The razor-sharp dialogue alone makes it worth...' })
  aiReason!: string;

  @ApiProperty({ example: ['dark', 'atmospheric', 'tense'], type: [String] })
  aiMoodTags!: string[];

  @ApiProperty({
    example: ['identity crisis', 'anti-consumerism'],
    type: [String],
  })
  aiThemes!: string[];

  @ApiProperty({
    example: ['psychological thriller', 'dark comedy'],
    type: [String],
  })
  aiGenres!: string[];

  @ApiProperty({ example: 88, minimum: 0, maximum: 100 })
  aiScore!: number;

  @ApiProperty({
    example: '2026-07-09T12:00:00.000Z',
    format: 'date-time',
  })
  aiGeneratedAt!: string;
}
