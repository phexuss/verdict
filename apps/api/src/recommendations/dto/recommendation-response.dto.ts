import { ApiProperty } from '@nestjs/swagger';
import {
  Locale,
  RecommendationItemType,
  RecommendationStatus,
} from '../../generated/prisma/enums.js';

export class CreateRecommendationResponseDto {
  @ApiProperty({ example: 'a8K2pQx19z' })
  slug!: string;
}

export class RecommendationGenreDto {
  @ApiProperty({ example: 'clxgenre123' })
  id!: string;

  @ApiProperty({ example: 28 })
  tmdbId!: number;

  @ApiProperty({ example: 'Action' })
  name!: string;
}

export class RecommendationMovieDto {
  @ApiProperty({ example: 'clxmovie123' })
  id!: string;

  @ApiProperty({ example: 550 })
  tmdbId!: number;

  @ApiProperty({ example: 'Fight Club', nullable: true, type: String })
  originalTitle!: string | null;

  @ApiProperty({ example: 'en', nullable: true, type: String })
  originalLanguage!: string | null;

  @ApiProperty({
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
    type: String,
  })
  posterPath!: string | null;

  @ApiProperty({
    example: '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg',
    nullable: true,
    type: String,
  })
  backdropPath!: string | null;

  @ApiProperty({
    example: '1999-10-15',
    nullable: true,
    type: String,
  })
  releaseDate!: string | null;

  @ApiProperty({ example: 139, nullable: true, type: Number })
  runtime!: number | null;

  @ApiProperty({ example: 128.42, nullable: true, type: Number })
  popularity!: number | null;

  @ApiProperty({ example: 8.4, nullable: true, type: Number })
  voteAverage!: number | null;

  @ApiProperty({ example: 28500, nullable: true, type: Number })
  voteCount!: number | null;

  @ApiProperty({ example: false })
  adult!: boolean;

  @ApiProperty({ example: 'Fight Club', nullable: true, type: String })
  title!: string | null;

  @ApiProperty({
    example: 'A movie overview.',
    nullable: true,
    type: String,
  })
  overview!: string | null;

  @ApiProperty({ type: [RecommendationGenreDto] })
  genres!: RecommendationGenreDto[];
}

export class RecommendationItemDto {
  @ApiProperty({ example: 'clxitem123' })
  id!: string;

  @ApiProperty({ example: 1 })
  position!: number;

  @ApiProperty({
    enum: RecommendationItemType,
    example: RecommendationItemType.SAFE,
  })
  type!: RecommendationItemType;

  @ApiProperty({
    example: 'The safest crowd-pleaser for tonight.',
    nullable: true,
    type: String,
  })
  reason!: string | null;

  @ApiProperty({ type: RecommendationMovieDto })
  movie!: RecommendationMovieDto;
}

export class RecommendationPreviewMovieDto {
  @ApiProperty({ example: 550 })
  tmdbId!: number;

  @ApiProperty({ example: 'Fight Club', nullable: true, type: String })
  title!: string | null;

  @ApiProperty({
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
    type: String,
  })
  posterPath!: string | null;

  @ApiProperty({
    example: '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg',
    nullable: true,
    type: String,
  })
  backdropPath!: string | null;
}

export class RecommendationListItemDto {
  @ApiProperty({ example: 'clxrecommendation123' })
  id!: string;

  @ApiProperty({ example: 'a8K2pQx19z' })
  slug!: string;

  @ApiProperty({
    enum: RecommendationStatus,
    example: RecommendationStatus.READY,
  })
  status!: RecommendationStatus;

  @ApiProperty({ example: ['dark', 'tense'], type: [String] })
  moods!: string[];

  @ApiProperty({ example: 'solo', nullable: true, type: String })
  groupType!: string | null;

  @ApiProperty({ example: 'medium', nullable: true, type: String })
  duration!: string | null;

  @ApiProperty({
    example: 'Three sharp picks for tonight',
    nullable: true,
    type: String,
  })
  title!: string | null;

  @ApiProperty({
    example: 'A compact movie trio tuned to your current mood.',
    nullable: true,
    type: String,
  })
  description!: string | null;

  @ApiProperty({
    example: '2026-05-30T13:05:39.417Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({ type: [RecommendationPreviewMovieDto] })
  movies!: RecommendationPreviewMovieDto[];
}

export class RecommendationResponseDto {
  @ApiProperty({ example: 'clxrecommendation123' })
  id!: string;

  @ApiProperty({ example: 'a8K2pQx19z' })
  slug!: string;

  @ApiProperty({ enum: Locale, example: Locale.EN })
  locale!: Locale;

  @ApiProperty({
    enum: RecommendationStatus,
    example: RecommendationStatus.READY,
  })
  status!: RecommendationStatus;

  @ApiProperty({ example: ['dark', 'tense'], type: [String] })
  moods!: string[];

  @ApiProperty({ example: 'solo', nullable: true, type: String })
  groupType!: string | null;

  @ApiProperty({ example: 'medium', nullable: true, type: String })
  duration!: string | null;

  @ApiProperty({
    example: 'Three sharp picks for tonight',
    nullable: true,
    type: String,
  })
  title!: string | null;

  @ApiProperty({
    example: 'A compact movie trio tuned to your current mood.',
    nullable: true,
    type: String,
  })
  description!: string | null;

  @ApiProperty({
    example: 'Chosen for pacing, tone, and contrast.',
    nullable: true,
    type: String,
  })
  aiReason!: string | null;

  @ApiProperty({
    example: '2026-05-30T13:05:39.417Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-05-30T13:05:39.417Z',
    format: 'date-time',
  })
  updatedAt!: string;

  @ApiProperty({ type: [RecommendationItemDto] })
  items!: RecommendationItemDto[];
}
