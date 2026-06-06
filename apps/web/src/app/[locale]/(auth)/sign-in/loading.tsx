import { Skeleton } from '@repo/ui/components/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <header className="mb-5.5 flex flex-col items-start justify-start gap-2">
          <Skeleton className="h-7 w-32 rounded-sm" />
          <Skeleton className="h-5 w-full max-w-sm rounded-sm" />
        </header>

        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded-sm" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          <Skeleton className="h-9 w-full rounded-4xl" />
          <Skeleton className="h-9 w-full rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
