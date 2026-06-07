import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateUserMovieDto {
  @ApiPropertyOptional({
    description: 'Whether the movie is saved to the user watchlist.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  saved?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the user has watched the movie.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  watched?: boolean;

  @ApiPropertyOptional({
    description: 'Positive or negative user reaction. Send null to clear it.',
    enum: ['LIKED', 'DISLIKED'],
    nullable: true,
    example: 'LIKED',
  })
  @IsOptional()
  @IsIn(['LIKED', 'DISLIKED', null])
  reaction?: 'LIKED' | 'DISLIKED' | null;

  @ApiPropertyOptional({
    description: 'User rating from 1 to 10. Send null to clear it.',
    minimum: 1,
    maximum: 10,
    nullable: true,
    type: Number,
    example: 8,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number | null;
}

export class UserMovieActionMovieDto {
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

  @ApiProperty({
    example: '1999-10-15',
    nullable: true,
    type: String,
  })
  releaseDate!: string | null;

  @ApiProperty({ example: 139, nullable: true, type: Number })
  runtime!: number | null;

  @ApiProperty({ example: 8.4, nullable: true, type: Number })
  voteAverage!: number | null;
}

export class UserMovieActionDto {
  @ApiProperty({ example: 'clxaction123' })
  id!: string;

  @ApiProperty({ example: 550 })
  tmdbId!: number;

  @ApiProperty({ type: UserMovieActionMovieDto })
  movie!: UserMovieActionMovieDto;

  @ApiProperty({
    nullable: true,
    type: String,
    format: 'date-time',
    example: '2026-06-06T10:00:00.000Z',
  })
  savedAt!: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    format: 'date-time',
    example: '2026-06-06T10:00:00.000Z',
  })
  watchedAt!: string | null;

  @ApiProperty({
    enum: ['LIKED', 'DISLIKED'],
    nullable: true,
    example: 'LIKED',
  })
  reaction!: 'LIKED' | 'DISLIKED' | null;

  @ApiProperty({ nullable: true, type: Number, example: 8 })
  rating!: number | null;

  @ApiProperty({ nullable: true, type: String })
  note!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}
