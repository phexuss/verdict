import { getTranslations } from 'next-intl/server';
import type { TmdbMovieCredits } from '@/api/generated/models';

interface CreditsCardProps {
  credits: TmdbMovieCredits;
}

export default async function CreditsCard({ credits }: CreditsCardProps) {
  const t = await getTranslations('CuratedPage.SlugPage');
  const directors = credits.crew.filter((person) => person.job === 'Director');
  const topCast = credits.cast.slice(0, 6);

  return (
    <div className="flex flex-col py-6 gap-4">
      <h2 className="text-sm uppercase font-medium tracking-widest mb-2">
        {t('credits')}
      </h2>

      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase text-muted-foreground">
          {t('director')}
        </p>
        <p>
          {directors.length > 0
            ? directors.map((director) => director.name).join(', ')
            : '-'}
        </p>
      </div>

      {topCast.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase text-muted-foreground">{t('cast')}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {topCast.map((person) => (
              <li className="flex flex-col" key={person.credit_id}>
                <span>{person.name}</span>
                {person.character ? (
                  <span className="text-muted-foreground text-sm">
                    {person.character}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
