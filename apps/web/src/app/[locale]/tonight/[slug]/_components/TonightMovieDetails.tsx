'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import {
  ArrowLeftLinear,
  RefreshLinear,
  StarBold,
} from '@solar-icons/react-perf';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { TmdbMovieCredits } from '@/api/generated/models';
import { useGetRecommendationBySlug } from '@/api/generated/recommendations/recommendations';
import { useGetMovieCredits } from '@/api/generated/tmdb/tmdb';
import MovieActionsButtons from '@/components/movie-actions/MovieActionsButtons';
import StorylineCard from '@/components/sections/curated/StorylineCard';
import { Link } from '@/i18n/navigation';
import {
  getCinematographyName,
  getDirectorName,
  getHumanReadableRuntime,
  getTopCast,
} from '@/lib/tmdb-helper';
import { TonightMovieDetailsSkeleton } from './TonightMovieDetailsSkeleton';

type PickSlug = 'safe' | 'risk' | 'wildcard';

type TonightMovieDetailsProps = {
  slug: string;
  pick: PickSlug;
};

const pickTypeBySlug = {
  safe: 'SAFE',
  risk: 'RISK',
  wildcard: 'WILDCARD',
} as const satisfies Record<PickSlug, 'SAFE' | 'RISK' | 'WILDCARD'>;

export function TonightMovieDetails({ slug, pick }: TonightMovieDetailsProps) {
  const locale = useLocale();
  const t = useTranslations('TonightPage.pickDetails');
  const pickT = useTranslations('TonightPage.genreMenu.picks');
  const {
    data: recommendation,
    error,
    isLoading,
    refetch,
  } = useGetRecommendationBySlug(slug, {
    query: {
      select: (response) => response.data,
    },
  });
  const item = recommendation?.items.find(
    (candidate) => candidate.type === pickTypeBySlug[pick],
  );
  const { data: credits, isLoading: isCreditsLoading } = useGetMovieCredits(
    item?.movie.tmdbId ?? 0,
    {
      locale: locale === 'ru' ? 'ru' : 'en',
    },
    {
      query: {
        enabled: Boolean(item),
        select: (response) => response.data,
      },
    },
  );

  if (isLoading) return <TonightMovieDetailsSkeleton />;

  if (error || !recommendation || !item) {
    return (
      <main className="mx-auto flex min-h-[60svh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="font-semibold text-2xl">{t('notFoundTitle')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('notFoundDescription')}
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/tonight/${slug}`}>
                <ArrowLeftLinear className="size-4" />
                {t('backToTrio')}
              </Link>
            </Button>
            <Button onClick={() => refetch()}>
              <RefreshLinear className="size-4" />
              {t('retry')}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const movie = item.movie;
  const title = movie.title ?? movie.originalTitle ?? t('fallbackTitle');
  const imagePath = movie.posterPath ?? movie.backdropPath;
  const pickLabel = pickT(`${pick}.label`);

  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Button asChild className="w-fit -ml-3" variant="ghost">
          <Link href={`/tonight/${slug}`}>
            <ArrowLeftLinear className="size-4" />
            {t('backToTrio')}
          </Link>
        </Button>

        <article className="grid w-full gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
          <div className="w-full max-w-sm justify-self-center lg:sticky lg:top-8 lg:max-w-none lg:justify-self-stretch">
            <div className="relative aspect-2/3 overflow-hidden rounded-md border border-sidebar-ring/8 bg-accent">
              {imagePath ? (
                <Image
                  alt={title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 32vw, (min-width: 768px) 45vw, 90vw"
                  src={`https://image.tmdb.org/t/p/w780${imagePath}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-foreground/70">
                  {title}
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <header className="flex flex-col gap-4 border-border border-b pb-6">
              <div className="flex flex-col gap-3">
                <p className="font-medium text-primary text-sm uppercase tracking-widest">
                  {pickLabel}
                </p>
                <h1 className="wrap-break-word font-medium text-4xl leading-tight md:text-5xl xl:text-6xl">
                  {title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium text-primary text-sm">
                {movie.releaseDate ? (
                  <p>{movie.releaseDate.slice(0, 4)}</p>
                ) : null}
                {movie.runtime ? (
                  <>
                    <Separator
                      className="h-4 bg-primary/35"
                      orientation="vertical"
                    />
                    <p>{getHumanReadableRuntime(movie.runtime, locale)}</p>
                  </>
                ) : null}
                {movie.voteAverage ? (
                  <>
                    <Separator
                      className="h-4 bg-primary/35"
                      orientation="vertical"
                    />
                    <div className="flex flex-row items-center gap-1.5">
                      <StarBold className="size-4" />
                      <p>{movie.voteAverage.toFixed(1)}</p>
                    </div>
                  </>
                ) : null}
              </div>

              {movie.genres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge
                      className="rounded-sm border border-accent-foreground/10 px-3 py-1.5 text-[0.75rem] capitalize"
                      key={genre.id}
                      variant="secondary"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
              <MovieActionsButtons tmdbId={movie.tmdbId} />
            </div>

            <AiReviewCard
              pickReason={item.reason}
              trioReason={recommendation.aiReason}
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] xl:items-start">
              <StorylineCard description={movie.overview ?? t('noOverview')} />
              {isCreditsLoading ? (
                <CreditsSkeleton />
              ) : (
                <TonightCreditsCard movieCredits={credits} />
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

type AiReviewCardProps = {
  pickReason: string | null;
  trioReason: string | null;
};

function AiReviewCard({ pickReason, trioReason }: AiReviewCardProps) {
  const t = useTranslations('TonightPage.pickDetails');

  return (
    <section className="flex flex-col gap-5 rounded-md border border-primary/25 bg-primary/10 p-4 shadow-[0_0_0_1px_rgba(247,219,166,0.04)]">
      <div className="flex items-center gap-2 text-primary">
        <StarBold className="size-5 shrink-0" />
        <h2 className="font-medium text-xl">{t('aiReview')}</h2>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium text-primary/85 text-sm uppercase">
          {t('whyThisPick')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {pickReason ?? '-'}
        </p>
      </div>

      {trioReason ? (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-primary/85 text-sm uppercase">
            {t('trioContext')}
          </p>
          <p className="text-foreground/70 text-sm leading-relaxed">
            {trioReason}
          </p>
        </div>
      ) : null}
    </section>
  );
}

type TonightCreditsCardProps = {
  movieCredits?: TmdbMovieCredits;
};

function TonightCreditsCard({ movieCredits }: TonightCreditsCardProps) {
  const t = useTranslations('CuratedPage.SlugPage');
  const directorName = movieCredits ? getDirectorName(movieCredits) : null;
  const topCast = movieCredits ? getTopCast(movieCredits, 5) : [];
  const cinematographyName = movieCredits
    ? getCinematographyName(movieCredits)
    : null;

  return (
    <section className="flex flex-col gap-5 rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <h2 className="font-medium text-xl">{t('credits')}</h2>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase">
          {t('director')}
        </p>
        <p>{directorName ?? '-'}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase">{t('cast')}</p>
        <div className="flex flex-col gap-0.5">
          {topCast.length > 0 ? (
            topCast.map((actor) => <p key={actor.credit_id}>{actor.name}</p>)
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase">
          {t('cinematography')}
        </p>
        <p>{cinematographyName ?? '-'}</p>
      </div>
    </section>
  );
}

function CreditsSkeleton() {
  return (
    <section className="flex flex-col gap-5 rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <div className="h-7 w-28 animate-pulse rounded-sm bg-muted" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-20 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-36 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-40 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-36 animate-pulse rounded-sm bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
      </div>
    </section>
  );
}
