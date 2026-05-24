import { Controller, Get } from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('trending-movies')
  async getTrendingMovies() {
    return this.tmdbService.fetchTrendingMovies();
  }
}
