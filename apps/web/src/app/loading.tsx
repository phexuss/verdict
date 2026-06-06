import { Skeleton } from '@repo/ui/components/skeleton';

export default function Loading() {
  return (
    <main className="min-h-svh bg-background px-5 py-6 md:px-20 md:py-8 xl:px-30">
      <div className="mb-10 flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-full" />
        <div className="hidden items-center gap-3 md:flex">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <div className="mx-auto flex min-h-[55svh] w-full max-w-4xl flex-col items-center justify-center gap-4 text-center">
        <Skeleton className="h-10 w-full max-w-md rounded-sm" />
        <Skeleton className="h-5 w-full max-w-xl rounded-sm" />
        <Skeleton className="h-5 w-full max-w-lg rounded-sm" />
      </div>
    </main>
  );
}
