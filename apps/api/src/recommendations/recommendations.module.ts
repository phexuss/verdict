import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module.js';
import { TmdbModule } from '../providers/tmdb/tmdb.module.js';
import { RecommendationsController } from './recommendations.controller.js';
import { RecommendationsService } from './recommendations.service.js';

@Module({
  imports: [AiModule, TmdbModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
