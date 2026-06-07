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
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { auth } from '../auth.js';
import { CreateRecommendationDto } from './dto/create-recommendation.dto.js';
import {
  CreateRecommendationResponseDto,
  RecommendationListItemDto,
  RecommendationResponseDto,
} from './dto/recommendation-response.dto.js';
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
    type: CreateRecommendationResponseDto,
  })
  create(
    @Body() dto: CreateRecommendationDto,
    @Session() session?: UserSession<typeof auth>,
  ): Promise<CreateRecommendationResponseDto> {
    return this.recommendationsService.create(dto, session?.user.id);
  }

  @Get('me')
  @ApiOperation({ operationId: 'getMyRecommendations' })
  @ApiOkResponse({
    type: [RecommendationListItemDto],
  })
  findMine(
    @Session() session: UserSession<typeof auth>,
  ): Promise<RecommendationListItemDto[]> {
    return this.recommendationsService.findByUser(session.user.id);
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ operationId: 'getRecommendationBySlug' })
  @ApiParam({ name: 'slug', example: 'a8K2pQx19z' })
  @ApiOkResponse({
    type: RecommendationResponseDto,
  })
  findBySlug(@Param('slug') slug: string): Promise<RecommendationResponseDto> {
    return this.recommendationsService.findBySlug(slug);
  }
}
