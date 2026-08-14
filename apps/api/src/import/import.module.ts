import { Module } from '@nestjs/common';
import { TmdbModule } from '../providers/tmdb/tmdb.module.js';
import { ImportController } from './import.controller.js';
import { ImportService } from './import.service.js';

@Module({
  imports: [TmdbModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
