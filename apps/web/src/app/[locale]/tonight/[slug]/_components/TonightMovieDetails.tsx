'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Separator } from '@repo/ui/components/separator';
import {
  ArrowLeftLinear,
  RefreshLinear,
  StarBold,
} from '@solar-icons/react-perf';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { getMovieTrailerAction } from '@/actions/tmdb';

import { useGetRecommendationBySlug } from '@/api/generated/recommendations/recommendations';
import { useGetMovieCredits } from '@/api/generated/tmdb/tmdb';
import MovieActionsButtons from '@/components/movie-actions/MovieActionsButtons';
import StorylineCard from '@/components/sections/curated/StorylineCard';
import { Link } from '@/i18n/navigation';
import { getHumanReadableRuntime } from '@/lib/tmdb-helper';
import { AiReviewCard } from './AiReviewCard';
import { CreditsSkeleton, TonightCreditsCard } from './TonightCreditsCard';
import { TonightMovieDetailsSkeleton } from './TonightMovieDetailsSkeleton';

const ease = [0.22, 1, 0.36, 1] as const;

const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const secVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

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
  const curatedT = useTranslations('CuratedPage.SlugPage');
  const pickT = useTranslations('TonightPage.genreMenu.picks');
  const {
    data: recommendation,
    error,
    isLoading,
    refetch,
  } = useGetRecommendationBySlug(slug, {
    query: { select: (response) => response.data },
  });
  const item = recommendation?.items.find(
    (candidate) => candidate.type === pickTypeBySlug[pick],
  );
  const { data: credits, isLoading: isCreditsLoading } = useGetMovieCredits(
    item?.movie.tmdbId ?? 0,
    { locale: locale === 'ru' ? 'ru' : 'en' },
    { query: { enabled: Boolean(item), select: (response) => response.data } },
  );

  const { data: trailerUrl } = useQuery({
    queryKey: ['movieTrailer', item?.movie.tmdbId, locale],
    queryFn: () =>
      getMovieTrailerAction(item!.movie.tmdbId, locale === 'ru' ? 'ru' : 'en'),
    enabled: Boolean(item?.movie.tmdbId),
  });

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <TonightMovieDetailsSkeleton />
        </motion.div>
      ) : error || !recommendation || !item ? (
        <motion.main
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto flex min-h-[60svh] w-full max-w-5xl items-center justify-center px-4 py-10"
        >
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
        </motion.main>
      ) : (
        (() => {
          const movie = item.movie;
          const title =
            movie.title ?? movie.originalTitle ?? t('fallbackTitle');
          const imagePath = movie.posterPath ?? movie.backdropPath;
          const pickLabel = pickT(`${pick}.label`);

          return (
            <motion.main
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16"
            >
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <Button asChild className="w-fit -ml-3" variant="ghost">
                  <Link href={`/tonight/${slug}`}>
                    <ArrowLeftLinear className="size-4" />
                    {t('backToTrio')}
                  </Link>
                </Button>

                <article className="grid w-full gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
                  <motion.div
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.1, ease }}
                    className="flex w-full max-w-sm flex-col gap-4 justify-self-center lg:sticky lg:top-8 lg:max-w-none lg:justify-self-stretch"
                  >
                    <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-foreground/8 bg-accent shadow-2xl">
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
                    {trailerUrl ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            className="w-full"
                            size="lg"
                          >
                            <Play className="fill-foreground" />
                            {curatedT('trailer')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="w-full overflow-hidden border-none bg-transparent sm:bg-background shadow-none sm:shadow-xl p-0 sm:max-w-5xl rounded-xl sm:rounded-2xl"
                          showCloseButton={false}
                        >
                          <DialogTitle className="sr-only">
                            {curatedT('trailer')}
                          </DialogTitle>
                          <DialogDescription className="sr-only">
                            {curatedT('trailerDescription')}
                          </DialogDescription>
                          <div className="relative aspect-video w-full">
                            <iframe
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 h-full w-full"
                              src={trailerUrl}
                              title="Trailer"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </motion.div>

                  <motion.div
                    variants={colVariants}
                    initial="hidden"
                    animate="show"
                    className="flex min-w-0 flex-col gap-6"
                  >
                    <motion.header
                      variants={secVariants}
                      className="flex flex-col gap-4 border-border border-b pb-6"
                    >
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
                          {pickLabel}
                        </p>
                        <h1 className="wrap-break-word font-semibold text-4xl leading-tight md:text-5xl xl:text-6xl">
                          {title}
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium text-foreground/70 text-sm">
                        {movie.releaseDate ? (
                          <p className="tabular-nums">
                            {movie.releaseDate.slice(0, 4)}
                          </p>
                        ) : null}
                        {movie.runtime ? (
                          <>
                            <Separator
                              className="h-4 bg-foreground/20"
                              orientation="vertical"
                            />
                            <p>
                              {getHumanReadableRuntime(movie.runtime, locale)}
                            </p>
                          </>
                        ) : null}
                        {movie.voteAverage ? (
                          <>
                            <Separator
                              className="h-4 bg-foreground/20"
                              orientation="vertical"
                            />
                            <div className="flex flex-row items-center gap-1.5">
                              <StarBold className="size-4 text-primary" />
                              <p className="tabular-nums">
                                {movie.voteAverage.toFixed(1)}
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>

                      {movie.genres.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre) => (
                            <Badge
                              className="rounded-full border border-accent-foreground/10 px-3 py-1 text-xs capitalize"
                              key={genre.id}
                              variant="secondary"
                            >
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </motion.header>

                    <motion.div
                      variants={secVariants}
                      className="rounded-xl border border-foreground/8 bg-accent p-4"
                    >
                      <MovieActionsButtons tmdbId={movie.tmdbId} />
                    </motion.div>

                    <motion.div variants={secVariants}>
                      <AiReviewCard
                        pickReason={item.reason}
                        trioReason={recommendation.aiReason}
                      />
                    </motion.div>

                    <motion.div
                      variants={secVariants}
                      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] xl:items-start"
                    >
                      <StorylineCard
                        description={movie.overview ?? t('noOverview')}
                      />
                      <AnimatePresence mode="wait">
                        {isCreditsLoading ? (
                          <motion.div
                            key="credits-skeleton"
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.15 },
                            }}
                          >
                            <CreditsSkeleton />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="credits"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35, ease }}
                          >
                            <TonightCreditsCard movieCredits={credits} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </article>
              </div>
            </motion.main>
          );
        })()
      )}
    </AnimatePresence>
  );
}


