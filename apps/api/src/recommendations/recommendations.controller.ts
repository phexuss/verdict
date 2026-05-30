import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  AllowAnonymous,
  OptionalAuth,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { CreateRecommendationDto } from './dto/create-recommendation.dto.js';
import { RecommendationsService } from './recommendations.service.js';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  @OptionalAuth()
  @ApiOperation({ operationId: 'createRecommendation' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', example: 'a8K2pQx19z' },
      },
      required: ['slug'],
    },
  })
  create(@Body() dto: CreateRecommendationDto) {
    return this.recommendationsService.create(dto);
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ operationId: 'getRecommendationBySlug' })
  @ApiParam({ name: 'slug', example: 'a8K2pQx19z' })
  findBySlug(@Param('slug') slug: string) {
    return this.recommendationsService.findBySlug(slug);
  }
}
