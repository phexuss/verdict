import { Skeleton } from '@repo/ui/components/skeleton';

const MOOD_SKELETON_ITEMS = [
  'mood-skeleton-1',
  'mood-skeleton-2',
  'mood-skeleton-3',
  'mood-skeleton-4',
  'mood-skeleton-5',
  'mood-skeleton-6',
  'mood-skeleton-7',
  'mood-skeleton-8',
  'mood-skeleton-9',
];

const PICK_SKELETON_ITEMS = [
  'pick-skeleton-safe',
  'pick-skeleton-risk',
  'pick-skeleton-wildcard',
];

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 pt-6 sm:px-6 md:gap-8 md:pt-10 lg:px-8">
      <div className="flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <Skeleton className="h-10 w-full max-w-xl rounded-sm" />
        <Skeleton className="h-6 w-full max-w-lg rounded-sm" />
      </div>

      <section className="w-full max-w-md overflow-hidden rounded-4xl bg-card py-6 text-card-foreground shadow-md ring-1 ring-foreground/5 md:max-w-3xl lg:max-w-none dark:ring-foreground/10">
        <div className="flex items-center justify-between gap-4 px-6">
          <Skeleton className="h-6 w-32 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>

        <div className="grid gap-6 px-6 pt-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
          <div>
            <div className="mb-4 flex flex-wrap justify-start gap-2">
              {MOOD_SKELETON_ITEMS.map((item) => (
                <Skeleton className="h-9 w-24 rounded-full" key={item} />
              ))}
            </div>

            <div className="border-border border-t py-5">
              <Skeleton className="mb-4 h-7 w-40 rounded-sm" />
              <div className="grid w-full grid-cols-3 gap-3">
                <Skeleton className="h-18 rounded-2xl sm:h-24 lg:h-28" />
                <Skeleton className="h-18 rounded-2xl sm:h-24 lg:h-28" />
                <Skeleton className="h-18 rounded-2xl sm:h-24 lg:h-28" />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-border border-t py-5">
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-7 w-36 rounded-sm" />
                <Skeleton className="h-4 w-20 rounded-sm" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex justify-between px-1">
                <Skeleton className="h-4 w-8 rounded-sm" />
                <Skeleton className="h-4 w-8 rounded-sm" />
                <Skeleton className="h-4 w-8 rounded-sm" />
                <Skeleton className="h-4 w-10 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <Skeleton className="h-4 w-28 rounded-sm" />

              <div className="grid w-full gap-2 md:grid-cols-3 lg:grid-cols-1">
                {PICK_SKELETON_ITEMS.map((item) => (
                  <div
                    className="flex min-h-30.5 w-full flex-row items-center gap-4 rounded-md border border-border bg-accent p-4 md:flex-col md:items-start lg:flex-row lg:items-center"
                    key={item}
                  >
                    <Skeleton className="size-12 shrink-0 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-6 w-28 rounded-sm" />
                      <Skeleton className="h-4 w-full rounded-sm" />
                      <Skeleton className="h-4 w-3/4 rounded-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </section>
    </main>
  );
}
