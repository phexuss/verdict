import { Skeleton } from '@repo/ui/components/skeleton';

const RECOMMENDATION_CARD_SKELETON_ITEMS = [
  'recommendation-skeleton-safe',
  'recommendation-skeleton-risk',
  'recommendation-skeleton-wildcard',
];

export function RecommendationDetailsSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-28 rounded-full" />

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-4 w-3 rounded-sm" />
            <Skeleton className="h-4 w-10 rounded-sm" />
          </div>

          <Skeleton className="h-12 w-full max-w-3xl rounded-sm md:h-16" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-sm" />
          <Skeleton className="h-5 w-full max-w-xl rounded-sm" />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {RECOMMENDATION_CARD_SKELETON_ITEMS.map((item) => (
          <article
            className="overflow-hidden rounded-lg border border-border bg-card"
            key={item}
          >
            <Skeleton className="aspect-2/3 w-full rounded-none" />

            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-20 rounded-sm" />
                <Skeleton className="h-5 w-10 rounded-sm" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-7 w-4/5 rounded-sm" />
                <Skeleton className="h-4 w-16 rounded-sm" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-sm" />
                <Skeleton className="h-4 w-11/12 rounded-sm" />
                <Skeleton className="h-4 w-3/4 rounded-sm" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-sm" />
                <Skeleton className="h-4 w-5/6 rounded-sm" />
                <Skeleton className="h-4 w-2/3 rounded-sm" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
