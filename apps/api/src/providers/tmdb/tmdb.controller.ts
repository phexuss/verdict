import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { TmdbService } from './tmdb.service.js';
import { TrendingMoviesResponse } from './tmdb.types.js';

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
}
