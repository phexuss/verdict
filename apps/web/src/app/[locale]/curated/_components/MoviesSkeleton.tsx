import { Skeleton } from '@repo/ui/components/skeleton';

const ITEMS = Array.from({ length: 8 }, (_, i) => `movie-skeleton-${i}`);

export function MoviesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {ITEMS.map((key) => (
        <article
          key={key}
          className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/5"
        >
          <div className="relative aspect-2/3 overflow-hidden bg-muted">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md border border-foreground/10 bg-background/60 px-2 py-1 backdrop-blur-md">
              <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              <Skeleton className="h-3 w-6 rounded-sm" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="space-y-0.5">
              <Skeleton className="h-3 w-8 rounded-sm" />
              <Skeleton className="mt-1 h-4 w-4/5 rounded-sm" />
              <Skeleton className="h-4 w-3/5 rounded-sm" />
            </div>

            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="space-y-1.5">
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
