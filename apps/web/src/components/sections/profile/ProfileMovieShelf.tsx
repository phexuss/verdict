'use client';

import { Skeleton } from '@repo/ui/components/skeleton';
import {
  BookmarkBold,
  DislikeBold,
  EyeLinear,
  StarBold,
} from '@solar-icons/react-perf';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { UserMovieActionDto } from '@/api/generated/models';
import { Link } from '@/i18n/navigation';

type ProfileMovieShelfProps = {
  movies?: UserMovieActionDto[];
  isLoading?: boolean;
};

export default function ProfileMovieShelf({
  movies,
  isLoading,
}: ProfileMovieShelfProps) {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const visibleMovies = movies?.filter(hasMovieAction).slice(0, 6) ?? [];

  return (
    <section className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-medium text-xl">{t('title')}</h3>
          <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
            {t('description')}
          </p>
        </div>
        <Link
          className="w-fit font-medium text-primary text-sm transition-colors hover:text-primary/80"
          href="/curated"
        >
          {t('browse')}
        </Link>
      </div>

      {isLoading ? (
        <MovieShelfSkeleton />
      ) : visibleMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visibleMovies.map((action) => (
            <MovieShelfCard action={action} key={action.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border bg-background/30 p-4">
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
};

function MovieShelfCard({ action }: MovieShelfCardProps) {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const movie = action.movie;
  const imagePath = movie.posterPath ?? movie.backdropPath;
  const title = movie.title ?? t('fallbackTitle');
  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <Link
      className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-background/30 transition-colors hover:border-primary/35"
      href={`/curated/${movie.tmdbId}`}
    >
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        {imagePath ? (
          <Image
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            fill
            sizes="(min-width: 1280px) 10vw, (min-width: 640px) 18vw, 42vw"
            src={`https://image.tmdb.org/t/p/w342${imagePath}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-muted-foreground text-xs">
            {title}
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-sm bg-background/90 px-1.5 py-1 font-medium text-xs backdrop-blur-sm">
          <StarBold className="size-3 text-primary" />
          {movie.voteAverage ? movie.voteAverage.toFixed(1) : '-'}
        </div>
      </div>

      <div className="flex min-h-24 flex-col gap-2 p-3">
        <div className="min-w-0">
          <h4 className="line-clamp-2 wrap-break-word font-medium text-sm leading-tight">
            {title}
          </h4>
          {releaseYear ? (
            <p className="mt-1 text-foreground/55 text-xs">{releaseYear}</p>
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

function MovieShelfSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {['movie-shelf-1', 'movie-shelf-2', 'movie-shelf-3'].map((item) => (
        <div
          className="overflow-hidden rounded-md border border-border bg-background/30"
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

function hasMovieAction(action: UserMovieActionDto) {
  return Boolean(
    action.savedAt || action.watchedAt || action.reaction || action.rating,
  );
}
