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
    <div className="flex flex-col justify-center">
      <Image
        alt={movie.title}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        width={350}
        height={350}
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      />
      <div className="flex flex-col gap-2 p-2">
        <h1 className="text-3xl">{movie.title}</h1>
        <div className="flex flex-row text-sm font-medium text-primary">
          <p>{movie.release_date.slice(0, 4)}</p>
          <Separator orientation="vertical" className="mx-3 bg-primary/35" />
          <p>{getHumanReadableRuntime(movie.runtime ?? 0, locale)}</p>
          <Separator orientation="vertical" className="mx-3 bg-primary/35" />
          <div className="flex flex-row gap-1.5 items-center">
            <StarBold className="size-4" />
            <p>{movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-1">
          {movie.genres.length &&
            movie.genres.map((genre) => (
              <Badge
                variant="secondary"
                className="rounded-sm text-[0.75rem] px-4 py-2 border border-accent-foreground/10 capitalize"
                key={genre.id}
              >
                {genre.name}
              </Badge>
            ))}
        </div>
      </div>

      <StorylineCard description={movie.overview} />

      <Separator className="" orientation="horizontal" />
      <CreditsCard movieCredits={credits} />
      <MovieActionsButtons tmdbId={movie.id} />
    </div>
  );
}
