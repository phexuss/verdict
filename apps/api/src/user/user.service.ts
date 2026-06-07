import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroqService } from '../ai/groq/groq.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { Locale } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TmdbService } from '../providers/tmdb/tmdb.service.js';
import { UpdateUserMovieDto } from './dto/update-user-movie.dto.js';

type UserMovieActionWithMovie = Prisma.UserMovieGetPayload<{
  include: {
    movie: {
      select: {
        tmdbId: true;
        originalTitle: true;
        posterPath: true;
        backdropPath: true;
        releaseDate: true;
        runtime: true;
        voteAverage: true;
        translations: {
          select: {
            title: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groqService: GroqService,
    private readonly tmdbService: TmdbService,
  ) {}

  async findProfile(userId: string) {
    const data = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return data;
  }

  async getTasteProfile(userId: string) {
    const profile = await this.prisma.userTasteProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        data: true,
        analyzedMovieCount: true,
        generatedAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Taste profile not found');
    }

    return profile;
  }

  async refreshTasteProfile(userId: string, locale: 'en' | 'ru') {
    const where: Prisma.UserMovieWhereInput = {
      userId,
      OR: [
        { savedAt: { not: null } },
        { watchedAt: { not: null } },
        { reaction: { not: null } },
        { rating: { not: null } },
      ],
    };

    const [actions, analyzedMovieCount] = await Promise.all([
      this.prisma.userMovie.findMany({
        where,
        include: {
          movie: {
            include: {
              translations: true,
              genres: {
                include: {
                  genre: { include: { translations: true } },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 80,
      }),
      this.prisma.userMovie.count({ where }),
    ]);

    if (analyzedMovieCount < 5) {
      throw new BadRequestException('Not enough watched movies');
    }

    const prismaLocale = locale === 'ru' ? Locale.RU : Locale.EN;
    const movies = actions.map(
      ({ savedAt, watchedAt, reaction, rating, movie }) => {
        const translation =
          movie.translations.find((item) => item.locale === prismaLocale) ??
          movie.translations[0];

        return {
          saved: Boolean(savedAt),
          watched: Boolean(watchedAt),
          reaction,
          rating,
          title: translation?.title ?? movie.originalTitle ?? 'Unknown',
          runtime: movie.runtime,
          genres: movie.genres
            .map(
              ({ genre }) =>
                genre.translations.find((item) => item.locale === prismaLocale)
                  ?.name ?? genre.translations[0]?.name,
            )
            .filter((name): name is string => Boolean(name)),
          moodTags: translation?.aiMoodTags ?? [],
          themes: translation?.aiThemes ?? [],
        };
      },
    );

    const data = await this.groqService.generateTasteProfile({
      locale,
      movies,
    });

    return this.prisma.userTasteProfile.upsert({
      where: { userId },
      create: {
        userId,
        data,
        analyzedMovieCount,
      },
      update: {
        data,
        analyzedMovieCount,
        generatedAt: new Date(),
      },
      select: {
        id: true,
        data: true,
        analyzedMovieCount: true,
        generatedAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserMovies(userId: string) {
    const movies = await this.prisma.userMovie.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            tmdbId: true,
            originalTitle: true,
            posterPath: true,
            backdropPath: true,
            releaseDate: true,
            runtime: true,
            voteAverage: true,
            translations: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return movies.map((movie) => this.toUserMovieActionDto(movie));
  }

  async updateUserMovie(
    userId: string,
    tmdbId: number,
    dto: UpdateUserMovieDto,
  ) {
    if (!this.hasMovieActionChanges(dto)) {
      throw new BadRequestException('No movie action changes provided');
    }

    const movie = await this.findOrCreateMovieByTmdbId(tmdbId);

    const action = await this.prisma.userMovie.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
      create: {
        userId,
        movieId: movie.id,
        savedAt: dto.saved ? new Date() : null,
        watchedAt: dto.watched ? new Date() : null,
        reaction: dto.reaction,
        rating: dto.rating,
      },
      update: {
        savedAt:
          dto.saved === undefined ? undefined : dto.saved ? new Date() : null,

        watchedAt:
          dto.watched === undefined
            ? undefined
            : dto.watched
              ? new Date()
              : null,

        reaction: dto.reaction,
        rating: dto.rating,
      },
      include: {
        movie: {
          select: {
            tmdbId: true,
            originalTitle: true,
            posterPath: true,
            backdropPath: true,
            releaseDate: true,
            runtime: true,
            voteAverage: true,
            translations: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return this.toUserMovieActionDto(action);
  }

  private hasMovieActionChanges(dto: UpdateUserMovieDto) {
    return (
      dto.saved !== undefined ||
      dto.watched !== undefined ||
      dto.reaction !== undefined ||
      dto.rating !== undefined
    );
  }

  private async findOrCreateMovieByTmdbId(tmdbId: number) {
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

  private toUserMovieActionDto(action: UserMovieActionWithMovie) {
    return {
      id: action.id,
      tmdbId: action.movie.tmdbId,
      movie: {
        tmdbId: action.movie.tmdbId,
        title:
          action.movie.translations[0]?.title ?? action.movie.originalTitle,
        posterPath: action.movie.posterPath,
        backdropPath: action.movie.backdropPath,
        releaseDate:
          action.movie.releaseDate?.toISOString().slice(0, 10) ?? null,
        runtime: action.movie.runtime,
        voteAverage: action.movie.voteAverage,
      },
      savedAt: action.savedAt?.toISOString() ?? null,
      watchedAt: action.watchedAt?.toISOString() ?? null,
      reaction: action.reaction,
      rating: action.rating,
      note: action.note,
      createdAt: action.createdAt.toISOString(),
      updatedAt: action.updatedAt.toISOString(),
    };
  }
}
