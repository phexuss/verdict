import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
} from 'class-validator';

export class CreateRecommendationDto {
  @ApiProperty({
    example: ['dark', 'tense', 'weird'],
    maxItems: 3,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  moods!: string[];

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
    example: 'en',
    enum: ['en', 'ru'],
  })
  @IsIn(['en', 'ru'])
  locale!: 'en' | 'ru';
}
