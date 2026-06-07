import { Skeleton } from '@repo/ui/components/skeleton';

export default function ProfileMoviesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-5 border-border border-b pb-6">
        <Skeleton className="h-9 w-36 rounded-4xl" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-sm" />
              <Skeleton className="h-12 w-full max-w-xl rounded-sm md:h-16" />
            </div>
            <Skeleton className="h-5 w-full max-w-2xl rounded-sm" />
          </div>
          <Skeleton className="h-5 w-40 rounded-sm" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          'profile-movies-1',
          'profile-movies-2',
          'profile-movies-3',
          'profile-movies-4',
          'profile-movies-5',
          'profile-movies-6',
          'profile-movies-7',
          'profile-movies-8',
        ].map((item) => (
          <article
            className="overflow-hidden rounded-md border border-border bg-background/30"
            key={item}
          >
            <Skeleton className="aspect-2/3 w-full rounded-none" />
            <div className="flex min-h-32 flex-col gap-2 p-4">
              <Skeleton className="h-5 w-full rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-sm" />
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
