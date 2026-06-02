import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroqService } from '../ai/groq/groq.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { Locale } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserMovieDto } from './dto/update-user-movie.dto.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groqService: GroqService,
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
    const movies = actions.map(({ watchedAt, reaction, rating, movie }) => {
      const translation =
        movie.translations.find((item) => item.locale === prismaLocale) ??
        movie.translations[0];

      return {
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
    });

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
    });
    return movies;
  }

  async addUserMovie(userId: string, tmdbId: number, dto: UpdateUserMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { tmdbId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.prisma.userMovie.upsert({
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
    });
  }
}
