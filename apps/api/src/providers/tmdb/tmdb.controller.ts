import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { TmdbService } from './tmdb.service.js';
import {
  TmdbMovieCredits,
  TmdbMovieDetails,
  TrendingMoviesResponse,
} from './tmdb.types.js';

@ApiTags('tmdb')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('trending-movies')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Get trending movies',
    description:
      'Returns popular movies from TMDB using the configured TMDB bearer token.',
    operationId: 'getTrendingMovies',
  })
  @ApiQuery({
    name: 'locale',
    required: false,
    enum: ['en', 'ru'],
  })
  @ApiOkResponse({
    description: 'Trending movies retrieved successfully.',
    type: TrendingMoviesResponse,
  })
  async getTrendingMovies(
    @Query('locale') locale?: 'en' | 'ru',
  ): Promise<TrendingMoviesResponse> {
    return this.tmdbService.fetchTrendingMovies({
      language: locale === 'ru' ? 'ru-RU' : 'en-US',
    });
  }

  @Get('movies/:tmdbId')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Get movie details',
    description: 'Returns localized details for a single TMDB movie.',
    operationId: 'getMovieDetails',
  })
  @ApiParam({
    name: 'tmdbId',
    example: 550,
  })
  @ApiQuery({
    name: 'locale',
    required: false,
    enum: ['en', 'ru'],
  })
  @ApiOkResponse({
    description: 'Movie details retrieved successfully.',
    type: TmdbMovieDetails,
  })
  async getMovieDetails(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Query('locale') locale?: 'en' | 'ru',
  ): Promise<TmdbMovieDetails> {
    return this.tmdbService.getMovieDetails({
      tmdbId,
      language: locale === 'ru' ? 'ru-RU' : 'en-US',
    });
  }

  @Get('movies/:tmdbId/credits')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Get movie credits',
    description: 'Returns localized cast and crew credits for a TMDB movie.',
    operationId: 'getMovieCredits',
  })
  @ApiParam({
    name: 'tmdbId',
    example: 550,
  })
  @ApiQuery({
    name: 'locale',
    required: false,
    enum: ['en', 'ru'],
  })
  @ApiOkResponse({
    description: 'Movie credits retrieved successfully.',
    type: TmdbMovieCredits,
  })
  async getMovieCredits(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Query('locale') locale?: 'en' | 'ru',
  ): Promise<TmdbMovieCredits> {
    return this.tmdbService.getMovieCredits({
      tmdbId,
      language: locale === 'ru' ? 'ru-RU' : 'en-US',
    });
  }
}
