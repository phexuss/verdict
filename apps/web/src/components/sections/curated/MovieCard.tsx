'use client';

import { Badge } from '@repo/ui/components/badge';
import { StarBold } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { TmdbMovie } from '@/api/generated/models';
import { getMovieGenreNames, getShortOverview } from '@/lib/tmdb-helper';

interface MovieCardProps {
  movie: TmdbMovie;
  locale: string;
  index?: number;
}

export function MovieCard({ movie, locale, index = 0 }: MovieCardProps) {
  const genreNames = getMovieGenreNames(movie.genre_ids, locale);
  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      className="surface surface-interactive group flex h-full flex-col overflow-hidden rounded-2xl will-change-transform transform-gpu"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        {movie.poster_path ? (
          <Image
            alt={movie.title}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground text-sm">
            {movie.title}
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-card via-card/40 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.76_0.13_65/0.25),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 font-medium text-xs shadow-[inset_0_1px_0_oklch(1_0_0/0.08),0_4px_14px_-4px_oklch(0_0_0/0.6)] backdrop-blur-md">
          <StarBold className="size-3.5 text-primary drop-shadow-[0_0_6px_oklch(0.76_0.13_65/0.8)]" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="space-y-0.5">
          {releaseYear ? (
            <p className="text-muted-foreground/60 text-xs tabular-nums">
              {releaseYear}
            </p>
          ) : null}
          <h2 className="line-clamp-2 font-semibold text-sm leading-snug sm:text-base transition-colors duration-300 group-hover:text-gold-soft">
            {movie.title}
          </h2>
        </div>

        {genreNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {genreNames.slice(0, 2).map((name) => (
              <Badge
                className="rounded-full border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-normal text-[11px] text-foreground/80"
                key={name}
                variant="outline"
              >
                {name}
              </Badge>
            ))}
          </div>
        ) : null}

        {movie.overview ? (
          <p className="hidden text-muted-foreground/75 text-sm leading-relaxed sm:line-clamp-3">
            {getShortOverview(movie.overview, 150)}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
