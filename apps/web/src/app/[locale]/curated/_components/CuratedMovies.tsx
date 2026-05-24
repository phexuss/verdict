'use client';

import { useGetTrendingMovies } from '@/api/generated/tmdb/tmdb';

export function CuratedMovies() {
  const { data, isLoading, error } = useGetTrendingMovies();

  if (error) {
    return <div>Failed to load trending movies</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
