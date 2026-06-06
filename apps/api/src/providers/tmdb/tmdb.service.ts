import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  TmdbMovieCredits,
  TmdbMovieDetails,
  TrendingMoviesResponse,
} from './tmdb.types.js';

type DiscoverMoviesParams = {
  language: string;
  genreIds?: number[];
  maxRuntimeMinutes?: number;
  minVoteAverage?: number;
  minVoteCount?: number;
  page?: number;
  sortBy?: string;
};

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

  async fetchTrendingMovies(params?: { language?: string }) {
    return this.discoverMovies({
      language: params?.language ?? this.LANGUAGE,
      sortBy: 'popularity.desc',
    });
  }

  async discoverMovies(
    params: DiscoverMoviesParams,
  ): Promise<TrendingMoviesResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<TrendingMoviesResponse>(
        `${this.BASE_URL}discover/movie`,
        {
          params: {
            include_adult: false,
            include_video: false,
            language: params.language,
            page: params.page ?? 1,
            sort_by: params.sortBy ?? 'popularity.desc',
            ...(params.genreIds?.length
              ? { with_genres: params.genreIds.join('|') }
              : {}),
            ...(params.maxRuntimeMinutes
              ? { 'with_runtime.lte': params.maxRuntimeMinutes }
              : {}),
            ...(params.minVoteAverage
              ? { 'vote_average.gte': params.minVoteAverage }
              : {}),
            ...(params.minVoteCount
              ? { 'vote_count.gte': params.minVoteCount }
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

  async getTrendingMovies(params: {
    language: string;
    maxRuntimeMinutes?: number;
  }): Promise<TrendingMoviesResponse> {
    return this.discoverMovies({
      language: params.language,
      maxRuntimeMinutes: params.maxRuntimeMinutes,
      sortBy: 'popularity.desc',
    });
  }

  async getMovieDetails(params: {
    tmdbId: number;
    language: string;
  }): Promise<TmdbMovieDetails> {
    const { data } = await firstValueFrom(
      this.httpService.get<TmdbMovieDetails>(
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

  async getMovieCredits(params: {
    tmdbId: number;
    language: string;
  }): Promise<TmdbMovieCredits> {
    const { data } = await firstValueFrom(
      this.httpService.get<TmdbMovieCredits>(
        `${this.BASE_URL}movie/${params.tmdbId}/credits`,
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
