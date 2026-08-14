import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Multer } from 'multer';
import { auth } from '../auth.js';
import { ImdbImportResultDto } from './dto/import-imdb.dto.js';
import { ImportService } from './import.service.js';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('imdb')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimes = ['text/csv', 'application/vnd.ms-excel'];
        const isCsvExtension = file.originalname?.endsWith('.csv');

        if (allowedMimes.includes(file.mimetype) || isCsvExtension) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Please upload a CSV file.',
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({
    operationId: 'importImdbRatings',
    summary: 'Import IMDb ratings from CSV',
    description:
      'Upload an IMDb "Your Ratings" CSV export file to import movie ratings into your library. ' +
      'Only movies (not TV series, episodes, etc.) will be imported. ' +
      'Existing ratings will not be overwritten.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'IMDb "Your Ratings" CSV export file.',
        },
      },
    },
  })
  @ApiOkResponse({
    type: ImdbImportResultDto,
    description:
      'Import results with counts and details of skipped/failed items.',
  })
  async importImdbRatings(
    @Session() session: UserSession<typeof auth>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImdbImportResultDto> {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Please attach a CSV file.',
      );
    }

    return this.importService.importImdbRatings(session.user.id, file.buffer);
  }
}
