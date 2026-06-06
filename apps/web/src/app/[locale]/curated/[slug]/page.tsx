import { Badge } from '@repo/ui/components/badge';
import { Separator } from '@repo/ui/components/separator';
import { StarBold } from '@solar-icons/react-perf';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMovieCredits, getMovieDetails } from '@/api/generated/tmdb/tmdb';
import MovieActionsButtons from '@/components/movie-actions/MovieActionsButtons';
import CreditsCard from '@/components/sections/curated/CreditsCard';
import StorylineCard from '@/components/sections/curated/StorylineCard';
import { getHumanReadableRuntime } from '@/lib/tmdb-helper';

type CuratedMoviePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function CuratedMoviePage({
  params,
}: CuratedMoviePageProps) {
  const { locale, slug } = await params;
  const tmdbId = Number(slug);

  if (!Number.isInteger(tmdbId)) {
    notFound();
  }

  const response = await getMovieDetails(tmdbId, {
    locale: locale === 'ru' ? 'ru' : 'en',
  });

  const creditsResponse = await getMovieCredits(tmdbId, {
    locale: locale === 'ru' ? 'ru' : 'en',
  });

  const movie = response.data;
  const credits = creditsResponse.data;

  return (
    <article className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
      <div className="w-full max-w-sm justify-self-center lg:sticky lg:top-8 lg:max-w-none lg:justify-self-stretch">
        <div className="relative aspect-2/3 overflow-hidden rounded-md border border-sidebar-ring/8 bg-accent">
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
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <header className="flex flex-col gap-4 border-border border-b pb-6">
          <div className="flex flex-col gap-3">
            <h1 className="wrap-break-word font-medium text-4xl leading-tight md:text-5xl xl:text-6xl">
              {movie.title}
            </h1>
            {movie.tagline ? (
              <p className="text-foreground/65 text-lg leading-relaxed">
                {movie.tagline}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium text-primary text-sm">
            {movie.release_date ? (
              <p>{movie.release_date.slice(0, 4)}</p>
            ) : null}
            {movie.runtime ? (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-primary/35"
                />
                <p>{getHumanReadableRuntime(movie.runtime, locale)}</p>
              </>
            ) : null}
            <Separator orientation="vertical" className="h-4 bg-primary/35" />
            <div className="flex flex-row items-center gap-1.5">
              <StarBold className="size-4" />
              <p>{movie.vote_average.toFixed(1)}</p>
            </div>
          </div>

          {movie.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge
                  className="rounded-sm border border-accent-foreground/10 px-3 py-1.5 text-[0.75rem] capitalize"
                  key={genre.id}
                  variant="secondary"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          ) : null}
        </header>

        <div className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
          <MovieActionsButtons tmdbId={movie.id} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] xl:items-start">
          <StorylineCard description={movie.overview} />
          <CreditsCard movieCredits={credits} />
        </div>
      </div>
    </article>
  );
}
