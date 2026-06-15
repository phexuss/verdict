import { notFound } from 'next/navigation';
import { getMovieCredits, getMovieDetails } from '@/api/generated/tmdb/tmdb';
import { CuratedMovieContent } from './_components/CuratedMovieContent';

type CuratedMoviePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function CuratedMoviePage({
  params,
}: CuratedMoviePageProps) {
  const { locale, slug } = await params;
  const tmdbId = Number(slug);

  if (!Number.isInteger(tmdbId)) {
    notFound();
  }

  const [response, creditsResponse] = await Promise.all([
    getMovieDetails(tmdbId, { locale: locale === 'ru' ? 'ru' : 'en' }),
    getMovieCredits(tmdbId, { locale: locale === 'ru' ? 'ru' : 'en' }),
  ]);

  return (
    <CuratedMovieContent
      credits={creditsResponse.data}
      locale={locale}
      movie={response.data}
    />
  );
}
