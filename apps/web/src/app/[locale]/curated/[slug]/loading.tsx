import { Skeleton } from '@repo/ui/components/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center">
      <Skeleton className="h-[350px] w-full max-w-[350px] rounded-lg" />

      <div className="flex flex-col gap-2 p-2">
        <Skeleton className="h-9 w-full max-w-[280px] rounded-sm" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-10 rounded-sm" />
          <Skeleton className="h-5 w-14 rounded-sm" />
          <Skeleton className="h-5 w-12 rounded-sm" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-sm" />
          <Skeleton className="h-9 w-24 rounded-sm" />
          <Skeleton className="h-9 w-16 rounded-sm" />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-accent-foreground/10 p-5">
        <Skeleton className="h-8 w-36 rounded-sm" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl rounded-sm" />
          <Skeleton className="h-4 w-full max-w-xl rounded-sm" />
          <Skeleton className="h-4 w-full max-w-lg rounded-sm" />
        </div>
      </div>
    </div>
  );
}
