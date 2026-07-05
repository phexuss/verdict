'use server';

import { getMovieTrailer } from '@/lib/tmdb-helper';

export async function getMovieTrailerAction(tmdbId: number, locale: string) {
  return getMovieTrailer(tmdbId, locale);
}
