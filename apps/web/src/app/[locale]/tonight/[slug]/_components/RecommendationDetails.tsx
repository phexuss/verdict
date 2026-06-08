'use client';

import { Button } from '@repo/ui/components/button';
import { ArrowLeftLinear, RefreshLinear } from '@solar-icons/react-perf';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetRecommendationBySlug } from '@/api/generated/recommendations/recommendations';
import { Link } from '@/i18n/navigation';
import { RecommendationDetailsSkeleton } from './RecommendationDetailsSkeleton';

type RecommendationDetailsProps = {
  slug: string;
};

const pickSlugByType = {
  SAFE: 'safe',
  RISK: 'risk',
  WILDCARD: 'wildcard',
} as const;

export function RecommendationDetails({ slug }: RecommendationDetailsProps) {
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

  if (isLoading) return <RecommendationDetailsSkeleton />;

  if (error || !recommendation) {
    return (
      <main className="mx-auto flex min-h-[60svh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">Could not load this trio</h1>
          <p className="text-muted-foreground text-sm">
            The recommendation may still be processing or the link may be stale.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/tonight">
                <ArrowLeftLinear className="size-4" />
                Back
              </Link>
            </Button>
            <Button onClick={() => refetch()}>
              <RefreshLinear className="size-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4">
        <Button asChild className="w-fit" variant="ghost">
          <Link href="/tonight">
            <ArrowLeftLinear className="size-4" />
            Tonight
          </Link>
        </Button>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm uppercase">
            <span>{recommendation.status}</span>
            <span>/</span>
            <span>{recommendation.locale}</span>
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            {recommendation.title ?? 'Your movie trio'}
          </h1>

          {recommendation.description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              {recommendation.description}
            </p>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {recommendation.items.map((item) => {
          const posterUrl = getTmdbImageUrl(
            item.movie.posterPath ?? item.movie.backdropPath,
          );
          const title = item.movie.title ?? item.movie.originalTitle ?? 'Movie';
          const pickSlug = pickSlugByType[item.type];

          return (
            <Link
              className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/35"
              href={`/tonight/${slug}/${pickSlug}`}
              key={item.id}
            >
              <div className="relative aspect-2/3 bg-muted">
                {posterUrl ? (
                  <Image
                    alt={title}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={posterUrl}
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-primary text-sm">
                    {pickT(`${pickSlug}.label`)}
                  </span>
                  {item.movie.releaseDate ? (
                    <span className="text-muted-foreground text-sm">
                      {item.movie.releaseDate.slice(0, 4)}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h2 className="font-semibold text-xl leading-tight">
                    {title}
                  </h2>
                  {item.movie.voteAverage ? (
                    <p className="mt-1 text-muted-foreground text-sm">
                      {item.movie.voteAverage.toFixed(1)} / 10
                    </p>
                  ) : null}
                </div>

                {item.reason ? (
                  <p className="text-sm leading-relaxed">{item.reason}</p>
                ) : null}

                {item.movie.overview ? (
                  <p className="line-clamp-4 text-muted-foreground text-sm leading-relaxed">
                    {item.movie.overview}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

function getTmdbImageUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  return `https://image.tmdb.org/t/p/w500${path}`;
}
