import { MoviesSkeleton } from './_components/MoviesSkeleton';

export default function Loading() {
  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      <MoviesSkeleton />
    </main>
  );
}
