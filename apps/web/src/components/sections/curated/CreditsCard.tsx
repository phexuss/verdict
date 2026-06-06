import { getTranslations } from 'next-intl/server';
import type { TmdbMovieCredits } from '@/api/generated/models';
import {
  getCinematographyName,
  getDirectorName,
  getTopCast,
} from '@/lib/tmdb-helper';

interface CreditsCardProps {
  movieCredits: TmdbMovieCredits;
}

export default async function CreditsCard({ movieCredits }: CreditsCardProps) {
  const t = await getTranslations('CuratedPage.SlugPage');
  const directorName = getDirectorName(movieCredits);
  const topCast = getTopCast(movieCredits, 5);
  const cinematographyName = getCinematographyName(movieCredits);

  return (
    <div className="flex flex-col py-6 gap-6">
      <h2 className="text-sm uppercase font-medium tracking-widest mb-2">
        {t('credits')}
      </h2>
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase text-muted-foreground">
          {t('director')}
        </p>
        <p>{directorName ?? '-'}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase text-muted-foreground">{t('cast')}</p>
        <div className="flex flex-col gap-0.5">
          {topCast.map((actor) => (
            <p key={actor.credit_id}>{actor.name}</p>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase text-muted-foreground">
          {t('cinematography')}
        </p>
        <p>{cinematographyName ?? '-'}</p>
      </div>
    </div>
  );
}
