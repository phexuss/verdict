import { Skeleton } from '@repo/ui/components/skeleton';

export function AiMovieReviewCtaSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-3/4 bg-primary/10" />
      <Skeleton className="h-9 w-40 rounded-md bg-primary/15" />
    </div>
  );
}
