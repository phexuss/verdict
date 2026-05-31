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
import {
  CreateRecommendationDto,
  type RecommendationMood,
} from './dto/create-recommendation.dto.js';
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

const moodDiscoveryProfiles = {
  dark: {
    genreIds: [18, 27, 53, 80, 9648],
  },
  tense: {
    genreIds: [27, 28, 53, 80, 9648],
  },
  weird: {
    genreIds: [14, 27, 878, 9648],
  },
  atmospheric: {
    genreIds: [14, 18, 53, 878, 9648],
  },
  comfort: {
    genreIds: [16, 35, 10749, 10751],
  },
  smart: {
    genreIds: [18, 99, 878, 9648],
  },
  fast: {
    genreIds: [12, 28, 53],
  },
  emotional: {
    genreIds: [16, 18, 10749],
  },
  funny: {
    genreIds: [35],
  },
} as const satisfies Record<RecommendationMood, { genreIds: number[] }>;

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
      const candidates = await this.getCandidates(dto);

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

  private async getCandidates(dto: CreateRecommendationDto) {
    const language = this.getTmdbLanguage(dto.locale);
    const genreIds = this.getDiscoveryGenreIds(dto.moods);

    const discoveryRequests = [
      { page: 1, sortBy: 'popularity.desc', minVoteCount: 80 },
      { page: 2, sortBy: 'popularity.desc', minVoteCount: 80 },
      { page: 1, sortBy: 'vote_average.desc', minVoteCount: 250 },
    ];

    const responses = await Promise.all(
      discoveryRequests.map((request) =>
        this.tmdbService.discoverMovies({
          language,
          genreIds,
          maxRuntimeMinutes: dto.maxRuntimeMinutes,
          minVoteCount: request.minVoteCount,
          page: request.page,
          sortBy: request.sortBy,
        }),
      ),
    );

    let movies = this.dedupeTmdbMovies(
      responses.flatMap((response) => response.results),
    );

    if (movies.length < 8) {
      const fallback = await this.tmdbService.discoverMovies({
        language,
        maxRuntimeMinutes: dto.maxRuntimeMinutes,
        minVoteCount: 50,
        sortBy: 'popularity.desc',
      });

      movies = this.dedupeTmdbMovies([...movies, ...fallback.results]);
    }

    return movies.slice(0, 30).map((movie) => ({
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

  private getDiscoveryGenreIds(moods: RecommendationMood[]) {
    return [
      ...new Set(moods.flatMap((mood) => moodDiscoveryProfiles[mood].genreIds)),
    ];
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
