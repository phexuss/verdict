import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TmdbService } from './tmdb.service.js';
import { TrendingMoviesResponse } from './tmdb.types.js';

@ApiTags('tmdb')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('trending-movies')
  @ApiOperation({
    summary: 'Get trending movies',
    description:
      'Returns popular movies from TMDB using the configured TMDB bearer token.',
    operationId: 'getTrendingMovies',
  })
  @ApiOkResponse({
    description: 'Trending movies retrieved successfully.',
    type: TrendingMoviesResponse,
  })
  async getTrendingMovies(): Promise<TrendingMoviesResponse> {
    return this.tmdbService.fetchTrendingMovies();
  }
}
