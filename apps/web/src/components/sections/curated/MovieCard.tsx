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
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/5 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_-8px_oklch(0.76_0.13_65/0.2)] will-change-transform transform-gpu"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        {movie.poster_path ? (
          <Image
            alt={movie.title}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground text-sm">
            {movie.title}
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md border border-foreground/10 bg-background/60 px-2 py-1 font-medium text-xs shadow-md backdrop-blur-md">
          <StarBold className="size-3.5 text-primary" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-0.5">
          {releaseYear ? (
            <p className="text-muted-foreground/60 text-xs tabular-nums">
              {releaseYear}
            </p>
          ) : null}
          <h2 className="line-clamp-2 font-semibold text-base leading-snug">
            {movie.title}
          </h2>
        </div>

        {genreNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {genreNames.slice(0, 2).map((name) => (
              <Badge
                className="rounded-full px-2.5 py-0.5 font-normal text-[11px]"
                key={name}
                variant="outline"
              >
                {name}
              </Badge>
            ))}
          </div>
        ) : null}

        {movie.overview ? (
          <p className="line-clamp-3 text-muted-foreground/75 text-sm leading-relaxed">
            {getShortOverview(movie.overview, 150)}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
