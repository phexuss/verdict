import { useTranslations } from 'next-intl';
import type { TmdbMovieCredits } from '@/api/generated/models';
import {
  getCinematographyName,
  getDirectorName,
  getTopCast,
} from '@/lib/tmdb-helper';

type TonightCreditsCardProps = {
  movieCredits?: TmdbMovieCredits;
};

export function TonightCreditsCard({ movieCredits }: TonightCreditsCardProps) {
  const t = useTranslations('CuratedPage.SlugPage');
  const directorName = movieCredits ? getDirectorName(movieCredits) : null;
  const topCast = movieCredits ? getTopCast(movieCredits, 5) : [];
  const cinematographyName = movieCredits
    ? getCinematographyName(movieCredits)
    : null;

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-foreground/8 bg-accent p-5">
      <h2 className="font-medium text-xl">{t('credits')}</h2>
      <div className="flex flex-col gap-1">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground/60">
          {t('director')}
        </p>
        <p className="text-sm text-foreground/85">{directorName ?? '-'}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground/60">
          {t('cast')}
        </p>
        <div className="flex flex-col gap-1">
          {topCast.length > 0 ? (
            topCast.map((actor) => (
              <p key={actor.credit_id} className="text-sm text-foreground/85">
                {actor.name}
              </p>
            ))
          ) : (
            <p className="text-sm text-foreground/85">-</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground/60">
          {t('cinematography')}
        </p>
        <p className="text-sm text-foreground/85">
          {cinematographyName ?? '-'}
        </p>
      </div>
    </section>
  );
}

export function CreditsSkeleton() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-foreground/8 bg-accent p-5">
      <div className="h-7 w-28 animate-pulse rounded-sm bg-muted" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-36 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-40 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-28 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
      </div>
    </section>
  );
}
