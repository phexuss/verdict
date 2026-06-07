import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { GroqService } from '../ai/groq/groq.service.js';
import type { MovieDiscoveryStrategy } from '../ai/schemas/movie-discovery-strategy.schema.js';
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

const tmdbGenreNames: Record<number, string> = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
};

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

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
      const discoveryStrategy =
        await this.groqService.buildMovieDiscoveryStrategy({
          locale: dto.locale,
          moods: dto.moods,
          group: dto.group,
          duration: dto.duration,
          maxRuntimeMinutes: dto.maxRuntimeMinutes,
        });

      const candidates = await this.getCandidates(dto, discoveryStrategy);

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
      this.logger.error(
        `Failed to create recommendation ${recommendation.slug}`,
        error instanceof Error ? error.stack : String(error),
      );

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

  private async getCandidates(
    dto: CreateRecommendationDto,
    strategy: MovieDiscoveryStrategy,
  ) {
    const language = this.getTmdbLanguage(dto.locale);
    const releaseDateGte = strategy.releaseYearFrom
      ? `${strategy.releaseYearFrom}-01-01`
      : undefined;
    const releaseDateLte = strategy.releaseYearTo
      ? `${strategy.releaseYearTo}-12-31`
      : undefined;
    const maxRuntimeMinutes = Math.min(
      strategy.maxRuntimeMinutes,
      dto.maxRuntimeMinutes,
    );
    const relaxedMinVoteCount = Math.max(
      50,
      Math.floor(strategy.minVoteCount / 2),
    );

    const movies = this.dedupeTmdbMovies(
      (
        await Promise.all([
          this.fetchDiscoveryBatch([
            {
              language,
              genreIds: strategy.genreIds,
              withoutGenreIds: strategy.withoutGenreIds,
              minRuntimeMinutes: strategy.minRuntimeMinutes ?? undefined,
              maxRuntimeMinutes,
              minVoteAverage: strategy.minVoteAverage ?? undefined,
              minVoteCount: strategy.minVoteCount,
              page: 1,
              releaseDateGte,
              releaseDateLte,
              sortBy: strategy.sortBy,
            },
            {
              language,
              genreIds: strategy.genreIds,
              withoutGenreIds: strategy.withoutGenreIds,
              minRuntimeMinutes: strategy.minRuntimeMinutes ?? undefined,
              maxRuntimeMinutes,
              minVoteAverage: strategy.minVoteAverage ?? undefined,
              minVoteCount: strategy.minVoteCount,
              page: 2,
              releaseDateGte,
              releaseDateLte,
              sortBy: strategy.sortBy,
            },
          ]),
          this.fetchDiscoveryBatch([
            {
              language,
              genreIds: strategy.genreIds,
              maxRuntimeMinutes,
              minVoteCount: relaxedMinVoteCount,
              page: 1,
              sortBy: 'popularity.desc',
            },
            {
              language,
              genreIds: strategy.genreIds,
              maxRuntimeMinutes,
              minVoteCount: 50,
              page: 2,
              sortBy: 'popularity.desc',
            },
          ]),
          this.fetchDiscoveryBatch([
            {
              language,
              maxRuntimeMinutes,
              minVoteCount: 80,
              page: 1,
              sortBy: 'popularity.desc',
            },
          ]),
        ])
      ).flat(),
    );

    return movies.slice(0, 24).map((movie) => ({
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
      genres: this.getGenreNames(movie.genre_ids ?? []),
      adult: movie.adult ?? false,
    }));
  }

  private async fetchDiscoveryBatch(
    requests: Parameters<TmdbService['discoverMovies']>[0][],
  ) {
    const responses = await Promise.all(
      requests.map((request) => this.tmdbService.discoverMovies(request)),
    );

    return responses.flatMap((response) => response.results);
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

  private getGenreNames(genreIds: number[]) {
    return genreIds
      .map((genreId) => tmdbGenreNames[genreId])
      .filter((genreName): genreName is string => Boolean(genreName));
  }

  private dedupeTmdbMovies<TMovie extends { id: number }>(movies: TMovie[]) {
    const seenIds = new Set<number>();

    return movies.filter((movie) => {
      if (seenIds.has(movie.id)) {
        return false;
      }

      seenIds.add(movie.id);
      return true;
    });
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
