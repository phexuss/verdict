export class TrendingMoviesQueryDto {
  page: number;
  results: [
    {
      adult: boolean;
      backdrop_path: string; // https://image.tmdb.org/t/p/original/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg
      genre_ids: number[];
      id: number;
      title: string;
      original_language: string;
      original_title: string;
      overview: string;
      poster_path: string;
      release_date: string;
      softcore: boolean;
      video: false;
      vote_average: number;
    },
  ];
}
