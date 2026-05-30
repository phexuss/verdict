import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { GroqService } from '../ai/groq/groq.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import {
  Locale,
  RecommendationItemType,
  RecommendationStatus,
} from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TmdbService } from '../providers/tmdb/tmdb.service.js';
import { CreateRecommendationDto } from './dto/create-recommendation.dto.js';
import type {
  CreateRecommendationResponseDto,
  RecommendationGenreDto,
  RecommendationResponseDto,
} from './dto/recommendation-response.dto.js';

const recommendationInclude = {
  items: {
    orderBy: {
      position: 'asc',
    },
    include: {
      movie: {
        include: {
          translations: true,
          genres: {
            include: {
              genre: {
                include: {
                  translations: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RecommendationInclude;

type RecommendationWithItems = Prisma.RecommendationGetPayload<{
  include: typeof recommendationInclude;
}>;

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
    private readonly groqService: GroqService,
  ) {}

  async create(
    dto: CreateRecommendationDto,
    userId?: string,
  ): Promise<CreateRecommendationResponseDto> {
    const slug = nanoid(10);
    const locale = dto.locale === 'ru' ? Locale.RU : Locale.EN;

    const recommendation = await this.prisma.recommendation.create({
      data: {
        slug,
        userId,
        locale,
        status: RecommendationStatus.PENDING,
        moods: dto.moods,
        groupType: dto.group,
        duration: dto.duration,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    try {
      const candidates = await this.getCandidates(
        dto.locale,
        dto.maxRuntimeMinutes,
      );

      if (candidates.length < 8) {
        throw new Error('Not enough candidate movies for recommendation');
      }

      const trio = await this.groqService.pickMovieTrio({
        locale: dto.locale,
        moods: dto.moods,
        group: dto.group,
        duration: dto.duration,
        maxRuntimeMinutes: dto.maxRuntimeMinutes,
        candidates: candidates.map((movie) => ({
          tmdbId: movie.tmdbId,
          title: movie.title,
          overview: movie.overview,
          genres: movie.genres,
          releaseDate: movie.releaseDate,
          runtime: movie.runtime,
          voteAverage: movie.voteAverage,
          popularity: movie.popularity,
        })),
      });

      const selectedMovies = await Promise.all(
        trio.picks.map(async (pick) => {
          const candidate = candidates.find(
            (movie) => movie.tmdbId === pick.tmdbId,
          );

          if (!candidate) {
            throw new Error(
              `Selected movie not found in candidates: ${pick.tmdbId}`,
            );
          }

          const movieDetails = await this.tmdbService.getMovieDetails({
            tmdbId: candidate.tmdbId,
            language: this.getTmdbLanguage(dto.locale),
          });

          const movie = await this.upsertMovieFromCandidate(
            {
              ...candidate,
              runtime: movieDetails.runtime ?? null,
            },
            dto.locale,
          );

          return {
            pick,
            movie,
          };
        }),
      );

      await this.prisma.recommendation.update({
        where: {
          id: recommendation.id,
        },
        data: {
          status: RecommendationStatus.READY,
          title: trio.title,
          description: trio.description,
          aiReason: trio.curationReason,
          items: {
            create: selectedMovies.map(({ pick, movie }, index) => ({
              movieId: movie.id,
              position: index + 1,
              type: this.mapPickType(pick.type),
              reason: pick.reason,
            })),
          },
        },
      });

      return {
        slug: recommendation.slug,
      };
    } catch (error) {
      await this.prisma.recommendation.update({
        where: {
          id: recommendation.id,
        },
        data: {
          status: RecommendationStatus.FAILED,
          aiReason:
            error instanceof Error
              ? error.message
              : 'Unknown recommendation error',
        },
      });

      throw new InternalServerErrorException('Failed to create recommendation');
    }
  }

  async findBySlug(slug: string): Promise<RecommendationResponseDto> {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: {
        slug,
      },
      include: recommendationInclude,
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    return this.toRecommendationResponse(recommendation);
  }

  private toRecommendationResponse(
    recommendation: RecommendationWithItems,
  ): RecommendationResponseDto {
    return {
      id: recommendation.id,
      slug: recommendation.slug,
      locale: recommendation.locale,
      status: recommendation.status,
      moods: recommendation.moods,
      groupType: recommendation.groupType,
      duration: recommendation.duration,
      title: recommendation.title,
      description: recommendation.description,
      aiReason: recommendation.aiReason,
      createdAt: recommendation.createdAt.toISOString(),
      updatedAt: recommendation.updatedAt.toISOString(),
      items: recommendation.items.map((item) => {
        const movie = item.movie;
        const translation =
          movie.translations.find(
            (candidate) => candidate.locale === recommendation.locale,
          ) ?? movie.translations[0];

        return {
          id: item.id,
          position: item.position,
          type: item.type,
          reason: item.reason,
          movie: {
            id: movie.id,
            tmdbId: movie.tmdbId,
            originalTitle: movie.originalTitle,
            originalLanguage: movie.originalLanguage,
            posterPath: movie.posterPath,
            backdropPath: movie.backdropPath,
            releaseDate: movie.releaseDate
              ? movie.releaseDate.toISOString().slice(0, 10)
              : null,
            runtime: movie.runtime,
            popularity: movie.popularity,
            voteAverage: movie.voteAverage,
            voteCount: movie.voteCount,
            adult: movie.adult,
            title: translation?.title ?? movie.originalTitle,
            overview: translation?.overview ?? null,
            genres: this.mapRecommendationGenres(
              movie.genres,
              recommendation.locale,
            ),
          },
        };
      }),
    };
  }

  private mapRecommendationGenres(
    movieGenres: RecommendationWithItems['items'][number]['movie']['genres'],
    locale: Locale,
  ): RecommendationGenreDto[] {
    return movieGenres
      .map((movieGenre) => {
        const translation =
          movieGenre.genre.translations.find(
            (candidate) => candidate.locale === locale,
          ) ?? movieGenre.genre.translations[0];

        return {
          id: movieGenre.genre.id,
          tmdbId: movieGenre.genre.tmdbId,
          name: translation?.name ?? '',
        };
      })
      .filter((genre) => genre.name.length > 0);
  }

  private async getCandidates(locale: 'en' | 'ru', maxRuntimeMinutes: number) {
    const response = await this.tmdbService.getTrendingMovies({
      language: this.getTmdbLanguage(locale),
      maxRuntimeMinutes,
    });

    return response.results.slice(0, 20).map((movie) => ({
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      runtime: null,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      genreIds: movie.genre_ids ?? [],
      genres: [],
      adult: movie.adult ?? false,
    }));
  }

  private async upsertMovieFromCandidate(
    candidate: {
      tmdbId: number;
      title: string;
      overview?: string | null;
      posterPath?: string | null;
      backdropPath?: string | null;
      releaseDate?: string | null;
      voteAverage?: number | null;
      voteCount?: number | null;
      popularity?: number | null;
      runtime?: number | null;
      originalTitle?: string | null;
      originalLanguage?: string | null;
      adult?: boolean;
    },
    locale: 'en' | 'ru',
  ) {
    const prismaLocale = locale === 'ru' ? Locale.RU : Locale.EN;

    const movie = await this.prisma.movie.upsert({
      where: {
        tmdbId: candidate.tmdbId,
      },
      create: {
        tmdbId: candidate.tmdbId,
        originalTitle: candidate.originalTitle,
        originalLanguage: candidate.originalLanguage,
        posterPath: candidate.posterPath,
        backdropPath: candidate.backdropPath,
        releaseDate: candidate.releaseDate
          ? new Date(candidate.releaseDate)
          : undefined,
        voteAverage: candidate.voteAverage,
        voteCount: candidate.voteCount,
        popularity: candidate.popularity,
        runtime: candidate.runtime,
        adult: candidate.adult ?? false,
      },
      update: {
        originalTitle: candidate.originalTitle,
        originalLanguage: candidate.originalLanguage,
        posterPath: candidate.posterPath,
        backdropPath: candidate.backdropPath,
        voteAverage: candidate.voteAverage,
        voteCount: candidate.voteCount,
        popularity: candidate.popularity,
        runtime: candidate.runtime,
        adult: candidate.adult ?? false,
      },
    });

    await this.prisma.movieTranslation.upsert({
      where: {
        movieId_locale: {
          movieId: movie.id,
          locale: prismaLocale,
        },
      },
      create: {
        movieId: movie.id,
        locale: prismaLocale,
        title: candidate.title,
        overview: candidate.overview,
      },
      update: {
        title: candidate.title,
        overview: candidate.overview,
      },
    });

    return movie;
  }

  private getTmdbLanguage(locale: 'en' | 'ru') {
    return locale === 'ru' ? 'ru-RU' : 'en-US';
  }

  private mapPickType(type: 'safe' | 'risk' | 'wildcard') {
    switch (type) {
      case 'safe':
        return RecommendationItemType.SAFE;
      case 'risk':
        return RecommendationItemType.RISK;
      case 'wildcard':
        return RecommendationItemType.WILDCARD;
    }
  }
}
