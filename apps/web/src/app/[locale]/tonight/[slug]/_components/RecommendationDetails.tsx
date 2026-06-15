'use client';

import { Button } from '@repo/ui/components/button';
import { ArrowLeftLinear, RefreshLinear } from '@solar-icons/react-perf';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetRecommendationBySlug } from '@/api/generated/recommendations/recommendations';
import { Link } from '@/i18n/navigation';
import { RecommendationDetailsSkeleton } from './RecommendationDetailsSkeleton';

type RecommendationDetailsProps = {
  slug: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const pickSlugByType = {
  SAFE: 'safe',
  RISK: 'risk',
  WILDCARD: 'wildcard',
} as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

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

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <RecommendationDetailsSkeleton />
        </motion.div>
      ) : error || !recommendation ? (
        <motion.main
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto flex min-h-[60svh] w-full max-w-5xl items-center justify-center px-4 py-10"
        >
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-semibold">Could not load this trio</h1>
            <p className="text-muted-foreground text-sm">
              The recommendation may still be processing or the link may be
              stale.
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
        </motion.main>
      ) : (
        <motion.main
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease }}
          className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:py-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-4"
          >
            <Button asChild className="w-fit" variant="ghost">
              <Link href="/tonight">
                <ArrowLeftLinear className="size-4" />
                Tonight
              </Link>
            </Button>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground/60 text-xs uppercase tracking-widest">
                <span>{recommendation.status}</span>
                <span>/</span>
                <span>{recommendation.locale}</span>
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                {recommendation.title ?? 'Your movie trio'}
              </h1>

              {recommendation.description ? (
                <p className="max-w-2xl text-base text-muted-foreground/80 md:text-lg">
                  {recommendation.description}
                </p>
              ) : null}
            </div>
          </motion.div>

          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-5 md:grid-cols-3 md:gap-6"
          >
            {recommendation.items.map((item) => {
              const posterUrl = getTmdbImageUrl(
                item.movie.posterPath ?? item.movie.backdropPath,
              );
              const title =
                item.movie.title ?? item.movie.originalTitle ?? 'Movie';
              const pickSlug = pickSlugByType[item.type];

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease } }}
                  className="will-change-transform transform-gpu"
                >
                  <Link
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/5 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_-8px_oklch(0.76_0.13_65/0.2)]"
                    href={`/tonight/${slug}/${pickSlug}`}
                  >
                    <div className="relative aspect-2/3 bg-muted">
                      {posterUrl ? (
                        <Image
                          alt={title}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          src={posterUrl}
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {pickT(`${pickSlug}.label`)}
                        </span>
                        {item.movie.releaseDate ? (
                          <span className="text-muted-foreground/60 text-xs tabular-nums">
                            {item.movie.releaseDate.slice(0, 4)}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="font-semibold text-lg leading-snug">
                          {title}
                        </h2>
                        {item.movie.voteAverage ? (
                          <p className="mt-0.5 text-muted-foreground/60 text-sm tabular-nums">
                            {item.movie.voteAverage.toFixed(1)} / 10
                          </p>
                        ) : null}
                      </div>

                      {item.reason ? (
                        <p className="text-sm leading-relaxed text-foreground/85">
                          {item.reason}
                        </p>
                      ) : null}

                      {item.movie.overview ? (
                        <p className="line-clamp-4 text-muted-foreground/70 text-sm leading-relaxed">
                          {item.movie.overview}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.section>
        </motion.main>
      )}
    </AnimatePresence>
  );
}

function getTmdbImageUrl(path?: string | null) {
  if (!path) {
    return null;
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
}
