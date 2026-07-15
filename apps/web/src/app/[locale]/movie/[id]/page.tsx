import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMovieAiReview } from '@/api/generated/movies/movies';
import { getMovieCredits, getMovieDetails } from '@/api/generated/tmdb/tmdb';
import { getMovieTrailer } from '@/lib/tmdb-helper';
import { CuratedMovieContent } from './_components/CuratedMovieContent';

type MoviePageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const tmdbId = Number(id);
  if (!Number.isInteger(tmdbId)) return {};
  try {
    const response = await getMovieDetails(tmdbId, {
      locale: locale === 'ru' ? 'ru' : 'en',
    });
    const movie = response.data;
    const title = movie?.title ?? 'Film';
    const description = movie?.overview ?? undefined;
    return {
      title,
      description,
      openGraph: { title: `${title} — Verdict`, description },
    };
  } catch {
    return {};
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { locale, id } = await params;
  const tmdbId = Number(id);

  if (!Number.isInteger(tmdbId)) {
    notFound();
  }

  const targetLocale = locale === 'ru' ? 'ru' : 'en';

  const [response, creditsResponse, trailerUrl, aiReviewResponse] =
    await Promise.all([
      getMovieDetails(tmdbId, { locale: targetLocale }),
      getMovieCredits(tmdbId, { locale: targetLocale }),
      getMovieTrailer(tmdbId, targetLocale),
      getMovieAiReview(tmdbId, { locale: targetLocale }).catch(() => null),
    ]);

  return (
    <CuratedMovieContent
      credits={creditsResponse.data}
      locale={locale}
      movie={response.data}
      trailerUrl={trailerUrl}
      initialAiReview={aiReviewResponse?.data ?? null}
    />
  );
}
