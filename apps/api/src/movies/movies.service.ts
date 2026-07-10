import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GroqService } from '../ai/groq/groq.service.js';
import { Locale } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TmdbService } from '../providers/tmdb/tmdb.service.js';
import type { AiReviewResponseDto } from './dto/ai-review.dto.js';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
    private readonly groqService: GroqService,
  ) {}

  async getAiReview(
    tmdbId: number,
    locale: 'en' | 'ru',
  ): Promise<AiReviewResponseDto> {
    const prismaLocale = locale === 'ru' ? Locale.RU : Locale.EN;

    const movie = await this.prisma.movie.findUnique({
      where: { tmdbId },
    });

    if (!movie) {
      throw new NotFoundException('AI review not found for this movie.');
    }

    const translation = await this.prisma.movieTranslation.findUnique({
      where: {
        movieId_locale: { movieId: movie.id, locale: prismaLocale },
      },
    });

    if (!translation?.aiGeneratedAt) {
      throw new NotFoundException('AI review not found for this movie.');
    }

    return this.toAiReviewResponse(translation);
  }

  async generateAiReview(
    tmdbId: number,
    locale: 'en' | 'ru',
  ): Promise<AiReviewResponseDto> {
    const prismaLocale = locale === 'ru' ? Locale.RU : Locale.EN;

    const movie = await this.ensureMovieExists(tmdbId);

    const existingTranslation =
      await this.prisma.movieTranslation.findUnique({
        where: {
          movieId_locale: {
            movieId: movie.id,
            locale: prismaLocale,
          },
        },
      });

    if (existingTranslation?.aiGeneratedAt) {
      return this.toAiReviewResponse(existingTranslation);
    }

    try {
      const enTranslation = await this.prisma.movieTranslation.findUnique({
        where: {
          movieId_locale: { movieId: movie.id, locale: Locale.EN },
        },
      });
      const ruTranslation = await this.prisma.movieTranslation.findUnique({
        where: {
          movieId_locale: { movieId: movie.id, locale: Locale.RU },
        },
      });

      const movieTitle =
        enTranslation?.title ?? ruTranslation?.title ?? movie.originalTitle ?? 'Unknown';
      const movieOverview =
        enTranslation?.overview ?? ruTranslation?.overview ?? null;

      const genres = await this.getMovieGenreNames(movie.id);

      const aiReview = await this.groqService.generateMovieAiReview({
        title: movieTitle,
        overview: movieOverview,
        genres,
        releaseDate: movie.releaseDate
          ? movie.releaseDate.toISOString().slice(0, 10)
          : null,
        runtime: movie.runtime,
        voteAverage: movie.voteAverage,
      });

      const now = new Date();

      await Promise.all([
        this.prisma.movieTranslation.upsert({
          where: {
            movieId_locale: { movieId: movie.id, locale: Locale.EN },
          },
          create: {
            movieId: movie.id,
            locale: Locale.EN,
            title: enTranslation?.title ?? movie.originalTitle ?? movieTitle,
            overview: enTranslation?.overview,
            aiSummary: aiReview.en.summary,
            aiAnalysis: aiReview.en.analysis,
            aiVerdict: aiReview.en.verdict,
            aiReason: aiReview.en.reason,
            aiMoodTags: aiReview.moodTags,
            aiThemes: aiReview.themes,
            aiGenres: aiReview.genres,
            aiScore: aiReview.score,
            aiGeneratedAt: now,
          },
          update: {
            aiSummary: aiReview.en.summary,
            aiAnalysis: aiReview.en.analysis,
            aiVerdict: aiReview.en.verdict,
            aiReason: aiReview.en.reason,
            aiMoodTags: aiReview.moodTags,
            aiThemes: aiReview.themes,
            aiGenres: aiReview.genres,
            aiScore: aiReview.score,
            aiGeneratedAt: now,
          },
        }),
        this.prisma.movieTranslation.upsert({
          where: {
            movieId_locale: { movieId: movie.id, locale: Locale.RU },
          },
          create: {
            movieId: movie.id,
            locale: Locale.RU,
            title: ruTranslation?.title ?? movie.originalTitle ?? movieTitle,
            overview: ruTranslation?.overview,
            aiSummary: aiReview.ru.summary,
            aiAnalysis: aiReview.ru.analysis,
            aiVerdict: aiReview.ru.verdict,
            aiReason: aiReview.ru.reason,
            aiMoodTags: aiReview.moodTags,
            aiThemes: aiReview.themes,
            aiGenres: aiReview.genres,
            aiScore: aiReview.score,
            aiGeneratedAt: now,
          },
          update: {
            aiSummary: aiReview.ru.summary,
            aiAnalysis: aiReview.ru.analysis,
            aiVerdict: aiReview.ru.verdict,
            aiReason: aiReview.ru.reason,
            aiMoodTags: aiReview.moodTags,
            aiThemes: aiReview.themes,
            aiGenres: aiReview.genres,
            aiScore: aiReview.score,
            aiGeneratedAt: now,
          },
        }),
      ]);

      const savedTranslation =
        await this.prisma.movieTranslation.findUniqueOrThrow({
          where: {
            movieId_locale: { movieId: movie.id, locale: prismaLocale },
          },
        });

      return this.toAiReviewResponse(savedTranslation);
    } catch (error) {
      this.logger.error(
        `Failed to generate AI review for tmdbId=${tmdbId}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to generate AI review. Please try again later.',
      );
    }
  }

  private async ensureMovieExists(tmdbId: number) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { tmdbId },
    });

    if (existingMovie) {
      return existingMovie;
    }

    const [enDetails, ruDetails] = await Promise.all([
      this.tmdbService.getMovieDetails({ tmdbId, language: 'en-US' }),
      this.tmdbService.getMovieDetails({ tmdbId, language: 'ru-RU' }),
    ]);

    const movie = await this.prisma.movie.create({
      data: {
        tmdbId,
        originalTitle: enDetails.original_title,
        originalLanguage: enDetails.original_language,
        posterPath: enDetails.poster_path,
        backdropPath: enDetails.backdrop_path,
        releaseDate: enDetails.release_date
          ? new Date(enDetails.release_date)
          : undefined,
        runtime: enDetails.runtime,
        voteAverage: enDetails.vote_average,
        voteCount: enDetails.vote_count,
        popularity: enDetails.popularity,
        adult: enDetails.adult,
      },
    });

    await this.upsertGenres(movie.id, enDetails.genres, ruDetails.genres);

    await Promise.all([
      this.prisma.movieTranslation.upsert({
        where: {
          movieId_locale: { movieId: movie.id, locale: Locale.EN },
        },
        create: {
          movieId: movie.id,
          locale: Locale.EN,
          title: enDetails.title,
          overview: enDetails.overview || null,
        },
        update: {
          title: enDetails.title,
          overview: enDetails.overview || null,
        },
      }),
      this.prisma.movieTranslation.upsert({
        where: {
          movieId_locale: { movieId: movie.id, locale: Locale.RU },
        },
        create: {
          movieId: movie.id,
          locale: Locale.RU,
          title: ruDetails.title,
          overview: ruDetails.overview || null,
        },
        update: {
          title: ruDetails.title,
          overview: ruDetails.overview || null,
        },
      }),
    ]);

    return movie;
  }

  private async upsertGenres(
    movieId: string,
    enGenres: { id: number; name: string }[],
    ruGenres: { id: number; name: string }[],
  ) {
    const ruGenreMap = new Map(ruGenres.map((g) => [g.id, g.name]));

    for (const genre of enGenres) {
      const dbGenre = await this.prisma.genre.upsert({
        where: { tmdbId: genre.id },
        create: { tmdbId: genre.id },
        update: {},
      });

      await this.prisma.genreTranslation.upsert({
        where: {
          genreId_locale: { genreId: dbGenre.id, locale: Locale.EN },
        },
        create: {
          genreId: dbGenre.id,
          locale: Locale.EN,
          name: genre.name,
        },
        update: { name: genre.name },
      });

      const ruName = ruGenreMap.get(genre.id);
      if (ruName) {
        await this.prisma.genreTranslation.upsert({
          where: {
            genreId_locale: { genreId: dbGenre.id, locale: Locale.RU },
          },
          create: {
            genreId: dbGenre.id,
            locale: Locale.RU,
            name: ruName,
          },
          update: { name: ruName },
        });
      }

      await this.prisma.movieGenre.upsert({
        where: {
          movieId_genreId: { movieId, genreId: dbGenre.id },
        },
        create: { movieId, genreId: dbGenre.id },
        update: {},
      });
    }
  }

  private async getMovieGenreNames(movieId: string): Promise<string[]> {
    const movieGenres = await this.prisma.movieGenre.findMany({
      where: { movieId },
      include: {
        genre: {
          include: { translations: { where: { locale: Locale.EN } } },
        },
      },
    });

    return movieGenres
      .map((mg) => mg.genre.translations[0]?.name)
      .filter((name): name is string => Boolean(name));
  }

  private toAiReviewResponse(translation: {
    aiSummary: string | null;
    aiAnalysis: string | null;
    aiVerdict: string | null;
    aiReason: string | null;
    aiMoodTags: string[];
    aiThemes: string[];
    aiGenres: string[];
    aiScore: number | null;
    aiGeneratedAt: Date | null;
  }): AiReviewResponseDto {
    return {
      aiSummary: translation.aiSummary ?? '',
      aiAnalysis: translation.aiAnalysis ?? '',
      aiVerdict: translation.aiVerdict ?? '',
      aiReason: translation.aiReason ?? '',
      aiMoodTags: translation.aiMoodTags,
      aiThemes: translation.aiThemes,
      aiGenres: translation.aiGenres,
      aiScore: translation.aiScore ?? 0,
      aiGeneratedAt: translation.aiGeneratedAt?.toISOString() ?? '',
    };
  }
}
