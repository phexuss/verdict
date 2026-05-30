import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TrendingMoviesResponse } from './tmdb.types.js';

@Injectable()
export class TmdbService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3/';
  private readonly BEARER_TOKEN: string;
  private readonly LANGUAGE = 'en-US';
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.BEARER_TOKEN = configService.getOrThrow<string>('TMDB_BEARER_TOKEN');
  }

  async fetchTrendingMovies() {
    return this.getTrendingMovies({
      language: this.LANGUAGE,
    });
  }

  async getTrendingMovies(params: {
    language: string;
    maxRuntimeMinutes?: number;
  }): Promise<TrendingMoviesResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<TrendingMoviesResponse>(
        `${this.BASE_URL}discover/movie`,
        {
          params: {
            include_adult: false,
            include_video: false,
            language: params.language,
            page: 1,
            sort_by: 'popularity.desc',
            ...(params.maxRuntimeMinutes
              ? { 'with_runtime.lte': params.maxRuntimeMinutes }
              : {}),
          },
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      ),
    );

    return data;
  }

  async getMovieDetails(params: { tmdbId: number; language: string }) {
    const { data } = await firstValueFrom(
      this.httpService.get<{ runtime?: number | null }>(
        `${this.BASE_URL}movie/${params.tmdbId}`,
        {
          params: {
            language: params.language,
          },
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      ),
    );

    return data;
  }
}
