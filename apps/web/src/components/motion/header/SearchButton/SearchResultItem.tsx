import { Film, Star } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { TmdbMovie } from '@/api/generated/models';
import { getMovieGenreNames } from '@/lib/tmdb-helper';

interface SearchResultItemProps {
  movie: TmdbMovie;
  isSelected: boolean;
  locale: string;
  onClick: () => void;
  onMouseEnter: () => void;
  itemRef: (el: HTMLButtonElement | null) => void;
  index: number;
}

export function SearchResultItem({
  movie,
  isSelected,
  locale,
  onClick,
  onMouseEnter,
  itemRef,
  index,
}: SearchResultItemProps) {
  const year = movie.release_date?.slice(0, 4) || '—';
  const genres = getMovieGenreNames(movie.genre_ids.slice(0, 2), locale);
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      type="button"
      ref={itemRef}
      data-selected={isSelected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="group/item flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-left transition-colors data-[selected=true]:bg-amber-500/10"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="h-4 w-4 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {movie.title}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{year}</span>
          {rating && (
            <>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {rating}
              </span>
            </>
          )}
          {genres.length > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="truncate">{genres.join(', ')}</span>
            </>
          )}
        </div>
      </div>
    </motion.button>
  );
}
