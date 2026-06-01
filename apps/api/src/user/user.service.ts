import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroqService } from '../ai/groq/groq.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { Locale, UserMovieStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
      status: { in: [UserMovieStatus.WATCHED, UserMovieStatus.DISLIKED] },
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
    const movies = actions.map(({ status, rating, movie }) => {
      const translation =
        movie.translations.find((item) => item.locale === prismaLocale) ??
        movie.translations[0];

      return {
        status:
          status === 'DISLIKED' ? ('DISLIKED' as const) : ('WATCHED' as const),
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
}
