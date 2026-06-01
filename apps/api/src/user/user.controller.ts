import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from '../auth.js';
import { UserProfileDto, UserTasteProfileDto } from './dto/user-profile.dto.js';
import { UserService } from './user.service.js';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ operationId: 'getCurrentUser' })
  @ApiOkResponse({ type: UserProfileDto })
  getMe(@Session() session: UserSession<typeof auth>) {
    return this.userService.findProfile(session.user.id);
  }

  @Get('me/taste-profile')
  @ApiOperation({ operationId: 'getTasteProfile' })
  @ApiOkResponse({ type: UserTasteProfileDto })
  getTasteProfile(@Session() session: UserSession<typeof auth>) {
    return this.userService.getTasteProfile(session.user.id);
  }

  @Post('me/taste-profile/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'refreshTasteProfile' })
  @ApiQuery({ name: 'locale', required: false, enum: ['en', 'ru'] })
  @ApiOkResponse({ type: UserTasteProfileDto })
  refreshTasteProfile(
    @Session() session: UserSession<typeof auth>,
    @Query('locale') locale?: 'en' | 'ru',
  ) {
    return this.userService.refreshTasteProfile(
      session.user.id,
      locale === 'ru' ? 'ru' : 'en',
    );
  }
}
