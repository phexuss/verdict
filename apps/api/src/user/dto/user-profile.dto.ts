import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'cm9user123' })
  id!: string;

  @ApiProperty({ example: 'Alex Morgan' })
  name!: string;

  @ApiProperty({ example: 'alex@example.com' })
  email!: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
    type: String,
  })
  image!: string | null;
}

export class TasteProfilePacingDto {
  @ApiProperty({ example: 32, minimum: 0, maximum: 100 })
  score!: number;

  @ApiProperty({ example: 'Slow burn' })
  label!: string;

  @ApiProperty({
    example: 'You lean towards deliberate, slow-building tension.',
  })
  description!: string;
}

export class TasteProfileEmotionalWeightDto {
  @ApiProperty({ example: 78, minimum: 0, maximum: 100 })
  score!: number;

  @ApiProperty({ example: 'Melancholic' })
  label!: string;
}

export class TasteProfileIdentityCardDto {
  @ApiProperty({ example: 'Neo-Noir' })
  title!: string;

  @ApiProperty({
    example: 'Primary stylistic preference across highly rated titles.',
  })
  description!: string;
}

export class TasteProfileRuntimeRangeDto {
  @ApiProperty({ example: 95 })
  min!: number;

  @ApiProperty({ example: 120 })
  max!: number;
}

export class TasteProfileDataDto {
  @ApiProperty({
    example: ['Tense', 'Atmospheric', 'Melancholic', 'Cerebral'],
    type: [String],
  })
  highAffinity!: string[];

  @ApiProperty({
    example: ['Slapstick', 'Gory'],
    type: [String],
  })
  lowAffinity!: string[];

  @ApiProperty({ type: TasteProfilePacingDto })
  pacing!: TasteProfilePacingDto;

  @ApiProperty({ type: TasteProfileEmotionalWeightDto })
  emotionalWeight!: TasteProfileEmotionalWeightDto;

  @ApiProperty({ type: [TasteProfileIdentityCardDto] })
  identityCards!: TasteProfileIdentityCardDto[];

  @ApiProperty({
    example: ['Practical Effects', 'Non-linear Narrative'],
    type: [String],
  })
  frequentlySeen!: string[];

  @ApiProperty({ type: TasteProfileRuntimeRangeDto })
  runtimeRange!: TasteProfileRuntimeRangeDto;

  @ApiProperty({
    example: ['Musicals', 'Anarchic comedies'],
    type: [String],
  })
  usuallySkip!: string[];

  @ApiProperty({
    example: 'You gravitate toward atmospheric stories with emotional weight.',
  })
  summary!: string;
}

export class UserTasteProfileDto {
  @ApiProperty({ example: 'cm9profile123' })
  id!: string;

  @ApiProperty({ type: TasteProfileDataDto })
  data!: TasteProfileDataDto;

  @ApiProperty({ example: 142 })
  analyzedMovieCount!: number;

  @ApiProperty({
    example: '2026-06-01T10:00:00.000Z',
    format: 'date-time',
  })
  generatedAt!: string;

  @ApiProperty({
    example: '2026-06-01T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: string;
}
