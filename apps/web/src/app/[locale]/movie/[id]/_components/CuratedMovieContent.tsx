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
import { StarBold } from '@solar-icons/react-perf';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type {
  AiReviewResponseDto,
  TmdbMovieCredits,
  TmdbMovieDetails,
} from '@/api/generated/models';
import MovieActionsButtons from '@/components/movie-actions/MovieActionsButtons';
import {
  getCinematographyName,
  getDirectorName,
  getHumanReadableRuntime,
  getTopCast,
} from '@/lib/tmdb-helper';
import { AiMovieReview } from '@/components/movie/AiMovieReview';

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

interface CuratedMovieContentProps {
  movie: TmdbMovieDetails;
  credits: TmdbMovieCredits;
  locale: string;
  trailerUrl: string | null;
  initialAiReview: AiReviewResponseDto | null;
}

export function CuratedMovieContent({
  movie,
  credits,
  locale,
  trailerUrl,
  initialAiReview,
}: CuratedMovieContentProps) {
  const t = useTranslations('CuratedPage.SlugPage');

  return (
    <article className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.1, ease }}
        className="flex w-full max-w-sm flex-col gap-4 justify-self-center lg:sticky lg:top-8 lg:max-w-none lg:justify-self-stretch"
      >
        <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-foreground/8 bg-accent shadow-2xl">
          {movie.poster_path ? (
            <Image
              alt={movie.title}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 32vw, (min-width: 768px) 45vw, 90vw"
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-foreground/70">
              {movie.title}
            </div>
          )}
        </div>

        {trailerUrl ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full" size="lg">
                <Play className="mr-2 size-4 fill-current" />
                {t('trailer')}
              </Button>
            </DialogTrigger>
            <DialogContent
              className="w-full overflow-hidden border-none bg-transparent sm:bg-background shadow-none sm:shadow-xl p-0 sm:max-w-5xl rounded-xl sm:rounded-2xl"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">{t('trailer')}</DialogTitle>
              <DialogDescription className="sr-only">
                {t('trailer')}
              </DialogDescription>
              <div className="relative aspect-video w-full">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  src={trailerUrl}
                  title={`${movie.title} — Trailer`}
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
            <h1 className="wrap-break-word font-semibold text-4xl leading-tight tracking-tight md:text-5xl xl:text-6xl">
              {movie.title}
            </h1>
            {movie.tagline ? (
              <p className="text-foreground/60 text-lg leading-relaxed">
                {movie.tagline}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium text-foreground/70 text-sm">
            {movie.release_date ? (
              <p className="tabular-nums">{movie.release_date.slice(0, 4)}</p>
            ) : null}
            {movie.runtime ? (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-foreground/20"
                />
                <p>{getHumanReadableRuntime(movie.runtime, locale)}</p>
              </>
            ) : null}
            <Separator
              orientation="vertical"
              className="h-4 bg-foreground/20"
            />
            <div className="flex flex-row items-center gap-1.5">
              <StarBold className="size-4 text-primary" />
              <p className="tabular-nums">{movie.vote_average.toFixed(1)}</p>
            </div>
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
          <MovieActionsButtons tmdbId={movie.id} />
        </motion.div>

        <motion.div variants={secVariants}>
          <AiMovieReview tmdbId={movie.id} locale={locale} initialReview={initialAiReview} />
        </motion.div>

        <motion.div
          variants={secVariants}
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] xl:items-start"
        >
          <section className="flex flex-col gap-3 rounded-xl border border-foreground/8 bg-accent p-5">
            <h2 className="font-medium text-xl">{t('title')}</h2>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {movie.overview}
            </p>
          </section>

          <section className="flex flex-col gap-5 rounded-xl border border-foreground/8 bg-accent p-5">
            <h2 className="font-medium text-xl">{t('credits')}</h2>
            <CreditsSection credits={credits} t={t} />
          </section>
        </motion.div>
      </motion.div>
    </article>
  );
}

function CreditsSection({
  credits,
  t,
}: {
  credits: TmdbMovieCredits;
  t: ReturnType<typeof useTranslations>;
}) {
  const director = getDirectorName(credits);
  const topCast = getTopCast(credits, 5);
  const cinematographer = getCinematographyName(credits);

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground/60">
          {t('director')}
        </p>
        <p className="text-sm text-foreground/85">{director ?? '-'}</p>
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
        <p className="text-sm text-foreground/85">{cinematographer ?? '-'}</p>
      </div>
    </>
  );
}
