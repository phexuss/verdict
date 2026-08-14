import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Locale } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TmdbService } from '../providers/tmdb/tmdb.service.js';
import type { ImdbImportResultDto } from './dto/import-imdb.dto.js';

type ImdbCsvRow = {
  imdbId: string;
  rating: number;
  dateRated: string;
  title: string;
  originalTitle: string;
  titleType: string;
  year: number;
};

const ALLOWED_TITLE_TYPES = new Set(['Movie', 'TV Movie']);
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 3000;

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
  ) {}

  async importImdbRatings(
    userId: string,
    fileBuffer: Buffer,
  ): Promise<ImdbImportResultDto> {
    const csvContent = fileBuffer.toString('utf-8');
    const rows = this.parseCsv(csvContent);

    if (rows.length === 0) {
      throw new BadRequestException(
        'CSV file is empty or has no valid data rows.',
      );
    }

    const result: ImdbImportResultDto = {
      total: rows.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      details: {
        skippedItems: [],
        failedItems: [],
      },
    };

    // Filter by title type
    const movieRows: ImdbCsvRow[] = [];
    for (const row of rows) {
      if (ALLOWED_TITLE_TYPES.has(row.titleType)) {
        movieRows.push(row);
      } else {
        result.skipped++;
        result.details.skippedItems.push({
          imdbId: row.imdbId,
          title: row.title,
          reason: `Filtered: not a movie (${row.titleType})`,
        });
      }
    }

    // Process in batches
    for (let i = 0; i < movieRows.length; i += BATCH_SIZE) {
      const batch = movieRows.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map((row) => this.processRow(userId, row)),
      );

      for (let j = 0; j < batchResults.length; j++) {
        const batchResult = batchResults[j]!;
        const row = batch[j]!;

        if (batchResult.status === 'fulfilled') {
          if (batchResult.value === 'imported') {
            result.imported++;
          } else {
            result.skipped++;
            result.details.skippedItems.push({
              imdbId: row.imdbId,
              title: row.title,
              reason: batchResult.value,
            });
          }
        } else {
          result.failed++;
          result.details.failedItems.push({
            imdbId: row.imdbId,
            title: row.title,
            error:
              batchResult.reason instanceof Error
                ? batchResult.reason.message
                : String(batchResult.reason),
          });
        }
      }

      // Rate limit delay between batches (skip after last batch)
      if (i + BATCH_SIZE < movieRows.length) {
        await this.sleep(BATCH_DELAY_MS);
      }
    }

    this.logger.log(
      `IMDb import for user ${userId}: ${result.imported} imported, ${result.skipped} skipped, ${result.failed} failed out of ${result.total} total`,
    );

    return result;
  }

  private async processRow(
    userId: string,
    row: ImdbCsvRow,
  ): Promise<'imported' | string> {
    // Resolve IMDb ID → TMDB ID
    const tmdbId = await this.tmdbService.findByImdbId(row.imdbId);

    if (tmdbId === null) {
      return `Not found on TMDB (IMDb ID: ${row.imdbId})`;
    }

    // Find or create movie in DB
    const movie = await this.findOrCreateMovie(tmdbId);

    // Check if user already has a rating for this movie
    const existingAction = await this.prisma.userMovie.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
    });

    if (
      existingAction?.rating !== null &&
      existingAction?.rating !== undefined
    ) {
      return `Already rated (existing: ${existingAction.rating}/10)`;
    }

    // Upsert user movie with rating and watchedAt
    const watchedAt = row.dateRated ? new Date(row.dateRated) : new Date();

    await this.prisma.userMovie.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
      create: {
        userId,
        movieId: movie.id,
        rating: row.rating,
        watchedAt,
      },
      update: {
        rating: row.rating,
        watchedAt: existingAction?.watchedAt ?? watchedAt,
      },
    });

    return 'imported';
  }

  private async findOrCreateMovie(tmdbId: number) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { tmdbId },
    });

    if (existingMovie) {
      return existingMovie;
    }

    const details = await this.tmdbService.getMovieDetails({
      tmdbId,
      language: 'en-US',
    });

    const movie = await this.prisma.movie.upsert({
      where: { tmdbId },
      create: {
        tmdbId: details.id,
        imdbId: details.imdb_id,
        originalTitle: details.original_title,
        originalLanguage: details.original_language,
        posterPath: details.poster_path,
        backdropPath: details.backdrop_path,
        releaseDate: details.release_date
          ? new Date(details.release_date)
          : undefined,
        runtime: details.runtime,
        popularity: details.popularity,
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        adult: details.adult,
      },
      update: {},
    });

    await this.prisma.movieTranslation.upsert({
      where: {
        movieId_locale: {
          movieId: movie.id,
          locale: Locale.EN,
        },
      },
      create: {
        movieId: movie.id,
        locale: Locale.EN,
        title: details.title,
        overview: details.overview,
      },
      update: {
        title: details.title,
        overview: details.overview,
      },
    });

    return movie;
  }

  private parseCsv(content: string): ImdbCsvRow[] {
    const lines = content.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines[0]!;
    const headers = this.parseCsvLine(headerLine);

    const colIndex = {
      const: headers.indexOf('Const'),
      yourRating: headers.indexOf('Your Rating'),
      dateRated: headers.indexOf('Date Rated'),
      title: headers.indexOf('Title'),
      originalTitle: headers.indexOf('Original Title'),
      titleType: headers.indexOf('Title Type'),
      year: headers.indexOf('Year'),
    };

    // Validate required columns exist
    if (colIndex.const === -1 || colIndex.yourRating === -1) {
      throw new BadRequestException(
        'Invalid CSV format: missing required columns "Const" and/or "Your Rating". Make sure this is an IMDb export file.',
      );
    }

    const rows: ImdbCsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const fields = this.parseCsvLine(lines[i]!);

      const imdbId = fields[colIndex.const]?.trim();
      const ratingStr = fields[colIndex.yourRating]?.trim();

      if (!imdbId || !ratingStr) {
        continue;
      }

      const rating = Number.parseInt(ratingStr, 10);
      if (Number.isNaN(rating) || rating < 1 || rating > 10) {
        continue;
      }

      rows.push({
        imdbId,
        rating,
        dateRated: fields[colIndex.dateRated]?.trim() ?? '',
        title: fields[colIndex.title]?.trim() ?? '',
        originalTitle: fields[colIndex.originalTitle]?.trim() ?? '',
        titleType: fields[colIndex.titleType]?.trim() ?? '',
        year: Number.parseInt(fields[colIndex.year]?.trim() ?? '0', 10),
      });
    }

    return rows;
  }

  /**
   * Parses a single CSV line, correctly handling quoted fields
   * that may contain commas and escaped quotes.
   */
  private parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            // Escaped quote
            current += '"';
            i++;
          } else {
            // End of quoted field
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          fields.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }

    fields.push(current);
    return fields;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
