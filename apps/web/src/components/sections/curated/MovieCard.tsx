import { Badge } from '@repo/ui/components/badge';
import { StarBold } from '@solar-icons/react-perf';
import Image from 'next/image';
import type { TmdbMovie } from '@/api/generated/models';
import { getMovieGenreNames, getShortOverview } from '@/lib/tmdb-helper';

interface MovieCardProps {
  movie: TmdbMovie;
  locale: string;
}

export function MovieCard({ movie, locale }: MovieCardProps) {
  const genreNames = getMovieGenreNames(movie.genre_ids, locale);
  const releaseYear = movie.release_date.slice(0, 4);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/45">
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        {movie.poster_path ? (
          <Image
            alt={movie.title}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground text-sm">
            {movie.title}
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-background/90 px-2 py-1 font-medium text-xs shadow-sm backdrop-blur-sm">
          <StarBold className="size-3.5 text-[#F7DBA6]" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          {releaseYear ? (
            <p className="text-muted-foreground text-xs">{releaseYear}</p>
          ) : null}
          <h2 className="line-clamp-2 font-semibold text-lg leading-tight">
            {movie.title}
          </h2>
        </div>

        {genreNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {genreNames.slice(0, 2).map((name) => (
              <Badge
                className="rounded-sm px-1.5 font-normal text-[11px]"
                key={name}
                variant="outline"
              >
                {name}
              </Badge>
            ))}
          </div>
        ) : null}

        {movie.overview ? (
          <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
            {getShortOverview(movie.overview, 150)}
          </p>
        ) : null}
      </div>
    </article>
  );
}
