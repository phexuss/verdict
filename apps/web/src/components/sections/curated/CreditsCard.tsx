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
    <section className="flex flex-col gap-5 rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <h2 className="font-medium text-xl">{t('credits')}</h2>
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
    </section>
  );
}
