import { z } from 'zod';

export const tmdbMovieGenreKeys = [
  'adventure',
  'fantasy',
  'animation',
  'drama',
  'horror',
  'action',
  'comedy',
  'history',
  'western',
  'thriller',
  'crime',
  'documentary',
  'science_fiction',
  'mystery',
  'music',
  'romance',
  'family',
  'war',
] as const;

export const tmdbMovieGenreIdByKey = {
  adventure: 12,
  fantasy: 14,
  animation: 16,
  drama: 18,
  horror: 27,
  action: 28,
  comedy: 35,
  history: 36,
  western: 37,
  thriller: 53,
  crime: 80,
  documentary: 99,
  science_fiction: 878,
  mystery: 9648,
  music: 10402,
  romance: 10749,
  family: 10751,
  war: 10752,
} as const satisfies Record<(typeof tmdbMovieGenreKeys)[number], number>;

export const tmdbDiscoverSortBy = [
  'popularity.desc',
  'vote_average.desc',
  'vote_count.desc',
  'primary_release_date.desc',
] as const;

export const movieDiscoveryStrategySchema = z
  .object({
    genreKeys: z.array(z.enum(tmdbMovieGenreKeys)).min(1).max(4),
    withoutGenreKeys: z.array(z.enum(tmdbMovieGenreKeys)).max(4),
    sortBy: z.enum(tmdbDiscoverSortBy),
    minVoteAverage: z
      .number()
      .min(0)
      .max(8.5)
      .transform((value) => (value > 0 ? value : null)),
    minVoteCount: z.number().int().min(50).max(1000),
    minRuntimeMinutes: z
      .number()
      .int()
      .min(0)
      .max(220)
      .transform((value) => (value >= 40 ? value : null)),
    maxRuntimeMinutes: z.number().int().min(60).max(240),
    releaseYearFrom: z
      .number()
      .int()
      .min(0)
      .max(2100)
      .transform((value) => (value >= 1920 ? value : null)),
    releaseYearTo: z
      .number()
      .int()
      .min(0)
      .max(2100)
      .transform((value) => (value >= 1920 ? value : null)),
    rationale: z.string().min(1).max(500),
  })
  .superRefine((strategy, ctx) => {
    if (
      strategy.minRuntimeMinutes &&
      strategy.minRuntimeMinutes > strategy.maxRuntimeMinutes
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'minRuntimeMinutes cannot exceed maxRuntimeMinutes',
        path: ['minRuntimeMinutes'],
      });
    }

    if (
      strategy.releaseYearFrom &&
      strategy.releaseYearTo &&
      strategy.releaseYearFrom > strategy.releaseYearTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'releaseYearFrom cannot exceed releaseYearTo',
        path: ['releaseYearFrom'],
      });
    }

    const genreKeys = new Set(strategy.genreKeys);
    const overlappingExcludedGenre = strategy.withoutGenreKeys.find((key) =>
      genreKeys.has(key),
    );

    if (overlappingExcludedGenre) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'withoutGenreKeys cannot include genreKeys',
        path: ['withoutGenreKeys'],
      });
    }
  })
  .transform((strategy) => ({
    genreIds: uniqueNumbers(
      strategy.genreKeys.map((key) => tmdbMovieGenreIdByKey[key]),
    ),
    withoutGenreIds: uniqueNumbers(
      strategy.withoutGenreKeys.map((key) => tmdbMovieGenreIdByKey[key]),
    ),
    sortBy: strategy.sortBy,
    minVoteAverage: strategy.minVoteAverage,
    minVoteCount: strategy.minVoteCount,
    minRuntimeMinutes: strategy.minRuntimeMinutes,
    maxRuntimeMinutes: strategy.maxRuntimeMinutes,
    releaseYearFrom: strategy.releaseYearFrom,
    releaseYearTo: strategy.releaseYearTo,
    rationale: strategy.rationale,
  }));

export type MovieDiscoveryStrategy = z.infer<
  typeof movieDiscoveryStrategySchema
>;

function uniqueNumbers(values: number[]) {
  return [...new Set(values)];
}
