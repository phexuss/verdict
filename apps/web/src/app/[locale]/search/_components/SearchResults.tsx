'use client';

import { useTranslations } from 'next-intl';
import { useSearchMovies } from '@/api/generated/tmdb/tmdb';
import { MovieCard } from '@/components/sections/curated/MovieCard';
import { Link } from '@/i18n/navigation';
import { detectQueryLocale } from '@/lib/tmdb-helper';
import { SearchPagination } from './SearchPagination';
import { SearchSkeleton } from './SearchSkeleton';

interface SearchResultsProps {
  query: string;
  page: number;
  locale: string;
}

export function SearchResults({ query, page, locale }: SearchResultsProps) {
  const t = useTranslations('SearchPage');

  const { data, isLoading, error } = useSearchMovies(
    {
      query,
      locale: detectQueryLocale(query, locale),
      page,
    },
    {
      query: {
        enabled: query.length >= 2,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  );

  if (!query || query.length < 2) {
    return (
      <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-muted-foreground text-lg">{t('noResultsHint')}</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
        <SearchSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-destructive text-lg">{t('error')}</p>
        </div>
      </main>
    );
  }

  const movieData = data?.data;
  const movies = movieData?.results ?? [];
  const totalPages = movieData?.total_pages ?? 1;
  const totalResults = movieData?.total_results ?? 0;

  if (movies.length === 0) {
    return (
      <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-foreground text-lg">{t('noResults', { query })}</p>
          <p className="text-muted-foreground text-sm">{t('noResultsHint')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      <div className="mb-8 space-y-2">
        <h1 className="font-bold text-2xl md:text-3xl">
          {t('resultsFor', { query })}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('totalResults', { count: totalResults.toString() })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie, index) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <MovieCard movie={movie} locale={locale} index={index} />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <SearchPagination
            currentPage={page}
            totalPages={totalPages}
            query={query}
          />
        </div>
      )}
    </main>
  );
}
