import { Skeleton } from '@repo/ui/components/skeleton';

export function TonightMovieDetailsSkeleton() {
  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Skeleton className="h-9 w-32 rounded-full" />

        <article className="grid w-full gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
          <div className="w-full max-w-sm justify-self-center lg:sticky lg:top-8 lg:max-w-none lg:justify-self-stretch">
            <Skeleton className="aspect-2/3 w-full rounded-md border border-sidebar-ring/8 bg-accent" />
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4 border-border border-b pb-6">
              <Skeleton className="h-4 w-28 rounded-sm" />
              <Skeleton className="h-12 w-full max-w-xl rounded-sm md:h-16 xl:h-20" />
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                <Skeleton className="h-5 w-10 rounded-sm" />
                <Skeleton className="h-5 w-14 rounded-sm" />
                <Skeleton className="h-5 w-12 rounded-sm" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-sm" />
                <Skeleton className="h-8 w-24 rounded-sm" />
                <Skeleton className="h-8 w-16 rounded-sm" />
              </div>
            </div>

            <div className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>

            <section className="rounded-md border border-primary/25 bg-primary/10 p-4">
              <div className="mb-5 flex items-center gap-2">
                <Skeleton className="size-5 rounded-sm" />
                <Skeleton className="h-7 w-32 rounded-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-4 w-full rounded-sm" />
                <Skeleton className="h-4 w-5/6 rounded-sm" />
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)]">
              <section className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
                <Skeleton className="mb-5 h-7 w-32 rounded-sm" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full rounded-sm" />
                  <Skeleton className="h-4 w-11/12 rounded-sm" />
                  <Skeleton className="h-4 w-full rounded-sm" />
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                </div>
              </section>

              <section className="rounded-md border border-sidebar-ring/8 bg-accent p-4">
                <Skeleton className="mb-5 h-7 w-28 rounded-sm" />
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24 rounded-sm" />
                    <Skeleton className="h-5 w-36 rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20 rounded-sm" />
                    <Skeleton className="h-5 w-40 rounded-sm" />
                    <Skeleton className="h-5 w-32 rounded-sm" />
                    <Skeleton className="h-5 w-36 rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-36 rounded-sm" />
                    <Skeleton className="h-5 w-32 rounded-sm" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
