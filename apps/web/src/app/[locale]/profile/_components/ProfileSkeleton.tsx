import { Skeleton } from '@repo/ui/components/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <header className="flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-36 rounded-sm" />
          <Skeleton className="h-12 w-full max-w-2xl rounded-sm md:h-16 xl:h-20" />
        </div>

        <div className="flex shrink-0 items-center gap-2 md:pb-2">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-56 rounded-sm" />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.95fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
            <div className="mb-5 flex items-center gap-2">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-7 w-56 rounded-sm" />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-32 rounded-sm" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-32 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-28 rounded-sm" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <ProfileIdentitySkeleton />
            <ProfileIdentitySkeleton />
          </div>

          <section className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="mb-4 flex items-center gap-2 sm:mb-0">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-7 w-48 rounded-sm" />
            </div>
            <Skeleton className="h-5 w-full max-w-sm rounded-sm sm:ml-auto" />
          </section>

          <section className="flex flex-col gap-4 rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-56 rounded-sm" />
              <Skeleton className="h-4 w-full max-w-md rounded-sm" />
            </div>
            <Skeleton className="h-9 w-full rounded-4xl sm:w-56" />
          </section>

          <section className="flex flex-col gap-4 rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-sm" />
                <Skeleton className="h-7 w-44 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-full max-w-md rounded-sm" />
              <Skeleton className="h-4 w-36 rounded-sm" />
            </div>
            <Skeleton className="h-9 w-full rounded-4xl sm:w-36" />
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <section className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
            <div className="mb-5 flex items-center gap-2">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-7 w-52 rounded-sm" />
            </div>
            <Skeleton className="h-6 w-full rounded-full" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Skeleton className="h-5 w-20 rounded-sm" />
              <Skeleton className="mx-auto h-5 w-24 rounded-sm" />
              <Skeleton className="ml-auto h-5 w-20 rounded-sm" />
            </div>
            <div className="mx-auto mt-5 flex w-full max-w-lg flex-col items-center gap-2">
              <Skeleton className="h-4 w-full max-w-md rounded-sm" />
              <Skeleton className="h-4 w-full max-w-sm rounded-sm" />
            </div>
          </section>

          <section className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
            <div className="mb-5 flex items-center gap-2">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-7 w-56 rounded-sm" />
            </div>
            <div className="flex flex-col gap-7">
              <ProfileBarSkeleton />
              <ProfileBarSkeleton muted />
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <ProfileMetricSkeleton />
            <ProfileMetricSkeleton />
          </div>
        </aside>
      </div>

      <section className="border-border border-t pt-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-8 w-56 rounded-sm" />
            </div>
            <Skeleton className="h-4 w-full max-w-xl rounded-sm" />
          </div>
          <Skeleton className="h-5 w-24 rounded-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ProfileRecommendationSkeleton />
          <ProfileRecommendationSkeleton />
          <ProfileRecommendationSkeleton />
        </div>
      </section>
    </div>
  );
}

function ProfileIdentitySkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <Skeleton className="mb-5 size-8 shrink-0 rounded-sm" />
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Skeleton className="h-7 w-3/4 rounded-sm" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-11/12 rounded-sm" />
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-sm" />
        </div>
      </div>
    </article>
  );
}

function ProfileBarSkeleton({ muted }: { muted?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-32 rounded-sm" />
        <Skeleton className="h-5 w-12 rounded-sm" />
      </div>
      <Skeleton
        className={
          muted
            ? 'h-2 w-full rounded-full bg-foreground/10'
            : 'h-2 w-full rounded-full'
        }
      />
    </div>
  );
}

function ProfileMetricSkeleton() {
  return (
    <section className="flex min-h-36 flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <div className="mb-5 flex items-center gap-2">
        <Skeleton className="size-6 rounded-sm" />
        <Skeleton className="h-7 w-28 rounded-sm" />
      </div>
      <Skeleton className="h-6 w-24 rounded-sm" />
      <Skeleton className="mt-3 h-5 w-16 rounded-sm" />
    </section>
  );
}

function ProfileRecommendationSkeleton() {
  return (
    <article className="min-h-52 overflow-hidden rounded-md border border-sidebar-ring/8 bg-accent">
      <div className="grid h-28 grid-cols-3 gap-1 bg-background/40 p-1">
        <Skeleton className="h-full rounded-sm" />
        <Skeleton className="h-full rounded-sm" />
        <Skeleton className="h-full rounded-sm" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-24 rounded-sm" />
        <Skeleton className="h-6 w-4/5 rounded-sm" />
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}
