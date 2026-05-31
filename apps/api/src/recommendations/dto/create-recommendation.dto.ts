import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const recommendationMoods = [
  'dark',
  'tense',
  'weird',
  'atmospheric',
  'comfort',
  'smart',
  'fast',
  'emotional',
  'funny',
] as const;

export type RecommendationMood = (typeof recommendationMoods)[number];

export class CreateRecommendationDto {
  @ApiProperty({
    example: ['dark', 'tense', 'weird'],
    enum: recommendationMoods,
    isArray: true,
    maxItems: 3,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsIn(recommendationMoods, { each: true })
  moods!: RecommendationMood[];

  @ApiProperty({
    example: 'solo',
    enum: ['solo', 'duo', 'group'],
  })
  @IsIn(['solo', 'duo', 'group'])
  group!: 'solo' | 'duo' | 'group';

  @ApiProperty({
    example: 'medium',
    enum: ['short', 'medium', 'long'],
  })
  @IsIn(['short', 'medium', 'long'])
  duration!: 'short' | 'medium' | 'long';

  @ApiProperty({
    example: 135,
    minimum: 60,
    maximum: 240,
    description: 'Maximum runtime per movie in minutes.',
  })
  @IsInt()
  @Min(60)
  @Max(240)
  maxRuntimeMinutes!: number;

  @ApiProperty({
    example: 'en',
    enum: ['en', 'ru'],
  })
  @IsIn(['en', 'ru'])
  locale!: 'en' | 'ru';
}
