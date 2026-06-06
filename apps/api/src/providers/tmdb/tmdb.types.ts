import { ApiProperty } from '@nestjs/swagger';

export class TmdbMovie {
  @ApiProperty({ example: false })
  adult: boolean;

  @ApiProperty({
    example: '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg',
    nullable: true,
    type: String,
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

  @ApiProperty({
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
    type: String,
  })
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

export class TmdbGenre {
  @ApiProperty({ example: 18 })
  id: number;

  @ApiProperty({ example: 'Drama' })
  name: string;
}

export class TmdbMovieDetails {
  @ApiProperty({ example: false })
  adult: boolean;

  @ApiProperty({
    example: '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg',
    nullable: true,
    type: String,
  })
  backdrop_path: string | null;

  @ApiProperty({ type: [TmdbGenre] })
  genres: TmdbGenre[];

  @ApiProperty({ example: 550 })
  id: number;

  @ApiProperty({ example: 'tt0137523', nullable: true, type: String })
  imdb_id: string | null;

  @ApiProperty({ example: 'en' })
  original_language: string;

  @ApiProperty({ example: 'Fight Club' })
  original_title: string;

  @ApiProperty({ example: 'A movie overview.' })
  overview: string;

  @ApiProperty({ example: 128.42 })
  popularity: number;

  @ApiProperty({
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
    type: String,
  })
  poster_path: string | null;

  @ApiProperty({ example: '1999-10-15' })
  release_date: string;

  @ApiProperty({ example: 139, nullable: true, type: Number })
  runtime: number | null;

  @ApiProperty({ example: 'Mischief. Mayhem. Soap.' })
  tagline: string;

  @ApiProperty({ example: 'Fight Club' })
  title: string;

  @ApiProperty({ example: false })
  video: boolean;

  @ApiProperty({ example: 8.4 })
  vote_average: number;

  @ApiProperty({ example: 28500 })
  vote_count: number;
}

export class TmdbCreditPerson {
  @ApiProperty({ example: false })
  adult: boolean;

  @ApiProperty({ example: 2 })
  gender: number;

  @ApiProperty({ example: 819 })
  id: number;

  @ApiProperty({ example: 'Acting' })
  known_for_department: string;

  @ApiProperty({ example: 'Edward Norton' })
  name: string;

  @ApiProperty({ example: 'Edward Norton' })
  original_name: string;

  @ApiProperty({ example: 37.508 })
  popularity: number;

  @ApiProperty({
    example: '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',
    nullable: true,
    type: String,
  })
  profile_path: string | null;
}

export class TmdbCastCredit extends TmdbCreditPerson {
  @ApiProperty({ example: 4 })
  cast_id: number;

  @ApiProperty({ example: 'The Narrator' })
  character: string;

  @ApiProperty({ example: '52fe4250c3a36847f80149f3' })
  credit_id: string;

  @ApiProperty({ example: 0 })
  order: number;
}

export class TmdbCrewCredit extends TmdbCreditPerson {
  @ApiProperty({ example: '52fe4250c3a36847f80149f7' })
  credit_id: string;

  @ApiProperty({ example: 'Directing' })
  department: string;

  @ApiProperty({ example: 'Director' })
  job: string;
}

export class TmdbMovieCredits {
  @ApiProperty({ example: 550 })
  id: number;

  @ApiProperty({ type: [TmdbCastCredit] })
  cast: TmdbCastCredit[];

  @ApiProperty({ type: [TmdbCrewCredit] })
  crew: TmdbCrewCredit[];
}
