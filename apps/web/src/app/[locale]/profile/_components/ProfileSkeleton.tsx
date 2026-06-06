import { Skeleton } from '@repo/ui/components/skeleton';

export function ProfileSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 md:px-8 md:py-12">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-7 w-full max-w-56 rounded-sm" />
            <Skeleton className="h-4 w-full max-w-72 rounded-sm" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <Skeleton className="h-6 w-32 rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-sm" />
          <Skeleton className="h-4 w-2/3 rounded-sm" />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <Skeleton className="h-6 w-36 rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-4/5 rounded-sm" />
          <Skeleton className="h-4 w-3/5 rounded-sm" />
        </div>
      </section>
    </main>
  );
}
