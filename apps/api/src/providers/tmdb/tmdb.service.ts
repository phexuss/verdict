import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TrendingMoviesResponse } from './tmdb.types.js';

@Injectable()
export class TmdbService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3/';
  private readonly BEARER_TOKEN: string;
  private readonly LANGUAGE = 'en-EN'; // No DB yet, so hardcoding this for now
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.BEARER_TOKEN = configService.getOrThrow<string>('TMDB_BEARER_TOKEN');
  }

  async fetchTrendingMovies() {
    const { data } = await firstValueFrom(
      this.httpService.get<TrendingMoviesResponse>(
        `${this.BASE_URL}discover/movie?include_adult=false&include_video=false&language=${this.LANGUAGE}&page=1&sort_by=popularity.desc`,
        {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      ),
    );
    return data;
  }

  async getTrendingMovies(params: { language: string }) {
    const response = await this.httpService.axiosRef.get(
      'https://api.themoviedb.org/3/trending/movie/day',
      {
        params: {
          language: params.language,
        },
        headers: {
          Authorization: `Bearer ${this.BEARER_TOKEN}`,
        },
      },
    );

    return response.data as {
      results: Array<{
        id: number;
        title: string;
        overview: string;
        poster_path: string | null;
        backdrop_path: string | null;
        release_date: string | null;
        vote_average: number;
        vote_count: number;
        popularity: number;
        original_title: string;
        original_language: string;
        genre_ids: number[];
        adult: boolean;
      }>;
    };
  }
}
