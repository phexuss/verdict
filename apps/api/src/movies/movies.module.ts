import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiModule } from '../ai/ai.module.js';
import { TmdbModule } from '../providers/tmdb/tmdb.module.js';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './movies.service.js';

@Module({
  imports: [
    AiModule,
    TmdbModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
      errorMessage: 'Rate limit exceeded. Please wait before generating another review.',
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
