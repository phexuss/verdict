import { Skeleton } from '@repo/ui/components/skeleton';

export function AiMovieReviewSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-24 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-11/12 bg-primary/10" />
        <Skeleton className="h-4 w-3/4 bg-primary/10" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-20 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-5/6 bg-primary/10" />
        <Skeleton className="h-4 w-2/3 bg-primary/10" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-16 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-4/5 bg-primary/10" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-16 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-3/4 bg-primary/10" />
        <Skeleton className="h-4 w-1/2 bg-primary/10" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20 bg-primary/15" />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-20 rounded-full bg-primary/15" />
          <Skeleton className="h-6 w-24 rounded-full bg-primary/15" />
          <Skeleton className="h-6 w-16 rounded-full bg-primary/15" />
          <Skeleton className="h-6 w-28 rounded-full bg-primary/15" />
        </div>
      </div>
    </div>
  );
}
