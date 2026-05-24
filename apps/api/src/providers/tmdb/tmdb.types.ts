import { ApiProperty } from '@nestjs/swagger';

export class TmdbMovie {
  @ApiProperty({ example: false })
  adult: boolean;

  @ApiProperty({
    example: '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg',
    nullable: true,
  })
  backdrop_path: string | null;

  @ApiProperty({ example: [28, 12, 878], type: [Number] })
  genre_ids: number[];

  @ApiProperty({ example: 550 })
  id: number;

  @ApiProperty({ example: 'en' })
  original_language: string;

  @ApiProperty({ example: 'Fight Club' })
  original_title: string;

  @ApiProperty({ example: 'A movie overview.' })
  overview: string;

  @ApiProperty({ example: 128.42 })
  popularity: number;

  @ApiProperty({ example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', nullable: true })
  poster_path: string | null;

  @ApiProperty({ example: '1999-10-15' })
  release_date: string;

  @ApiProperty({ example: 'Fight Club' })
  title: string;

  @ApiProperty({ example: false })
  video: boolean;

  @ApiProperty({ example: 8.4 })
  vote_average: number;

  @ApiProperty({ example: 28500 })
  vote_count: number;
}

export class TrendingMoviesResponse {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ type: [TmdbMovie] })
  results: TmdbMovie[];

  @ApiProperty({ example: 500 })
  total_pages: number;

  @ApiProperty({ example: 10000 })
  total_results: number;
}
