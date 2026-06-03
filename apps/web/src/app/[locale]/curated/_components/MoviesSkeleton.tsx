import { Skeleton } from '@repo/ui/components/skeleton';

const MOVIES_SKELETON_ITEMS = [
  'movie-skeleton-1',
  'movie-skeleton-2',
  'movie-skeleton-3',
  'movie-skeleton-4',
  'movie-skeleton-5',
  'movie-skeleton-6',
  'movie-skeleton-7',
  'movie-skeleton-8',
];

export function MoviesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MOVIES_SKELETON_ITEMS.map((item) => (
        <article
          className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card"
          key={item}
        >
          <div className="relative aspect-2/3 overflow-hidden bg-muted">
            <Skeleton className="h-full w-full rounded-none" />
            <Skeleton className="absolute top-3 right-3 h-6 w-14 rounded-sm bg-background/80" />
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12 rounded-sm" />

              <div className="space-y-1.5">
                <Skeleton className="h-5 w-4/5 rounded-sm" />
                <Skeleton className="h-5 w-3/5 rounded-sm" />
              </div>
            </div>

            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-14 rounded-sm" />
              <Skeleton className="h-5 w-16 rounded-sm" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-sm" />
              <Skeleton className="h-3.5 w-11/12 rounded-sm" />
              <Skeleton className="h-3.5 w-4/5 rounded-sm" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
