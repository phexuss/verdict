'use client';

import { useLocale } from 'next-intl';
import { useGetTrendingMovies } from '@/api/generated/tmdb/tmdb';
import { MovieCard } from '@/components/sections/curated/MovieCard';
import { Link } from '@/i18n/navigation';
import { MoviesSkeleton } from './MoviesSkeleton';

export function CuratedMovies() {
  const locale = useLocale();
  const {
    data: movies,
    error,
    isLoading,
  } = useGetTrendingMovies(
    {
      locale: locale === 'ru' ? 'ru' : 'en',
    },
    {
      query: {
        select: (response) => response.data,
      },
    },
  );

  if (error) {
    return <div>Failed to load trending movies</div>;
  }

  if (isLoading) return <MoviesSkeleton />;

  if (!movies) {
    return null;
  }

  const filteredMovies =
    locale === 'ru'
      ? movies.results.filter((movie) => /[а-яё]/i.test(movie.title))
      : movies.results;

  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <Link href={`/curated/${movie.id}`} key={movie.id}>
            <MovieCard movie={movie} locale={locale} key={movie.id} />
          </Link>
        ))}
      </div>
    </main>
  );
}
