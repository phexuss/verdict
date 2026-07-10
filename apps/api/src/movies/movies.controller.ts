import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AiReviewResponseDto, GenerateAiReviewDto } from './dto/ai-review.dto.js';
import { MoviesService } from './movies.service.js';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get(':tmdbId/ai-review')
  @AllowAnonymous()
  @ApiOperation({ operationId: 'getMovieAiReview' })
  @ApiParam({ name: 'tmdbId', example: 550, type: Number })
  @ApiQuery({ name: 'locale', enum: ['en', 'ru'], example: 'en' })
  @ApiOkResponse({ type: AiReviewResponseDto })
  @ApiNotFoundResponse({ description: 'AI review not yet generated for this movie.' })
  async getAiReview(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Query('locale') locale: 'en' | 'ru' = 'en',
  ): Promise<AiReviewResponseDto> {
    return this.moviesService.getAiReview(tmdbId, locale);
  }

  @Post(':tmdbId/ai-review')
  @AllowAnonymous()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'generateMovieAiReview' })
  @ApiParam({ name: 'tmdbId', example: 550, type: Number })
  @ApiOkResponse({ type: AiReviewResponseDto })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded. Try again later.',
  })
  async generateAiReview(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Body() dto: GenerateAiReviewDto,
  ): Promise<AiReviewResponseDto> {
    return this.moviesService.generateAiReview(tmdbId, dto.locale);
  }
}
