'use client';

import { Skeleton } from '@repo/ui/components/skeleton';
import { cn } from '@repo/ui/lib/utils';
import {
  BookmarkBold,
  DislikeBold,
  EyeLinear,
  StarBold,
} from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { UserMovieActionDto } from '@/api/generated/models';
import { Link } from '@/i18n/navigation';

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

type ProfileMovieShelfProps = {
  movies?: UserMovieActionDto[];
  isLoading?: boolean;
  variant?: 'embedded' | 'page';
};

export default function ProfileMovieShelf({
  movies,
  isLoading,
  variant = 'embedded',
}: ProfileMovieShelfProps) {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const markedMovies = movies?.filter(hasMovieAction) ?? [];
  const visibleMovies =
    variant === 'page' ? markedMovies : markedMovies.slice(0, 6);

  return (
    <section
      className={cn(
        variant === 'embedded'
          ? 'rounded-xl border border-foreground/8 bg-accent p-4'
          : 'w-full',
      )}
    >
      {variant === 'embedded' ? (
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-medium text-xl">{t('title')}</h3>
            <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>
          <Link
            className="w-fit font-medium text-primary text-sm transition-colors hover:text-primary/80"
            href="/profile/movies"
          >
            {t('open')}
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <MovieShelfSkeleton variant={variant} />
      ) : visibleMovies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={cn(
            'grid gap-3',
            variant === 'page'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3',
          )}
        >
          {visibleMovies.map((action) => (
            <motion.div key={action.id} variants={itemVariants}>
              <MovieShelfCard action={action} variant={variant} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-xl border border-border bg-background/30 p-4">
          <p className="font-medium text-base">{t('emptyTitle')}</p>
          <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
            {t('emptyDescription')}
          </p>
        </div>
      )}
    </section>
  );
}

type MovieShelfCardProps = {
  action: UserMovieActionDto;
  variant?: 'embedded' | 'page';
};

function MovieShelfCard({ action, variant = 'embedded' }: MovieShelfCardProps) {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const movie = action.movie;
  const imagePath = movie.posterPath ?? movie.backdropPath;
  const title = movie.title ?? t('fallbackTitle');
  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <Link
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background/30 ring-1 ring-foreground/5 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_6px_24px_-6px_oklch(0.76_0.13_65/0.18)]"
      href={`/curated/${movie.tmdbId}`}
    >
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        {imagePath ? (
          <Image
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            fill
            sizes={
              variant === 'page'
                ? '(min-width: 1280px) 18rem, (min-width: 1024px) 28vw, (min-width: 640px) 42vw, 92vw'
                : '(min-width: 1280px) 10vw, (min-width: 640px) 18vw, 42vw'
            }
            src={`https://image.tmdb.org/t/p/w342${imagePath}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-muted-foreground text-xs">
            {title}
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md border border-foreground/10 bg-background/60 px-1.5 py-1 font-medium text-xs backdrop-blur-md">
          <StarBold className="size-3 text-primary" />
          {movie.voteAverage ? movie.voteAverage.toFixed(1) : '-'}
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 p-3',
          variant === 'page' ? 'min-h-32 sm:p-4' : 'min-h-24',
        )}
      >
        <div className="min-w-0">
          <h4
            className={cn(
              'line-clamp-2 wrap-break-word font-medium leading-tight',
              variant === 'page' ? 'text-base' : 'text-sm',
            )}
          >
            {title}
          </h4>
          {releaseYear ? (
            <p className="mt-1 text-foreground/50 text-xs tabular-nums">
              {releaseYear}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {action.savedAt ? (
            <MovieActionPill icon={<BookmarkBold className="size-3" />}>
              {t('badges.saved')}
            </MovieActionPill>
          ) : null}
          {action.watchedAt ? (
            <MovieActionPill icon={<EyeLinear className="size-3" />}>
              {t('badges.watched')}
            </MovieActionPill>
          ) : null}
          {action.reaction === 'DISLIKED' ? (
            <MovieActionPill icon={<DislikeBold className="size-3" />}>
              {t('badges.disliked')}
            </MovieActionPill>
          ) : null}
          {action.rating ? (
            <MovieActionPill icon={<StarBold className="size-3" />}>
              {action.rating}/10
            </MovieActionPill>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

type MovieActionPillProps = {
  children: ReactNode;
  icon: ReactNode;
};

function MovieActionPill({ children, icon }: MovieActionPillProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary/10 px-2 py-1 text-[0.68rem] text-foreground/80 leading-none">
      {icon}
      {children}
    </span>
  );
}

function MovieShelfSkeleton({
  variant = 'embedded',
}: {
  variant?: 'embedded' | 'page';
}) {
  const skeletonItems =
    variant === 'page'
      ? ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']
      : ['s1', 's2', 's3'];

  return (
    <div
      className={cn(
        'grid gap-3',
        variant === 'page'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-2 sm:grid-cols-3',
      )}
    >
      {skeletonItems.map((item) => (
        <div
          className="overflow-hidden rounded-xl border border-border bg-background/30"
          key={item}
        >
          <Skeleton className="aspect-2/3 w-full rounded-none" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-2/3 rounded-sm" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function hasMovieAction(action: UserMovieActionDto) {
  return Boolean(
    action.savedAt || action.watchedAt || action.reaction || action.rating,
  );
}
