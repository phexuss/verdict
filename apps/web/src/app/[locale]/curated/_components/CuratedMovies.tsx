'use client';

import { useLocale } from 'next-intl';
import { useGetTrendingMovies } from '@/api/generated/tmdb/tmdb';

export function CuratedMovies() {
  const locale = useLocale();
  const { data, error } = useGetTrendingMovies({
    locale: locale === 'ru' ? 'ru' : 'en',
  }); // replace later with enchanced movies endpoint

  if (error) {
    return <div>Failed to load trending movies</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
