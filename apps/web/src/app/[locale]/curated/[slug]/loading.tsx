import { Skeleton } from '@repo/ui/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] xl:gap-12">
      <Skeleton className="aspect-2/3 w-full max-w-sm justify-self-center rounded-md lg:max-w-none" />

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4 border-border border-b pb-6">
          <Skeleton className="h-12 w-full max-w-xl rounded-sm md:h-16" />
          <Skeleton className="h-5 w-full max-w-md rounded-sm" />
          <div className="flex gap-3">
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

        <Skeleton className="h-18 rounded-md" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)]">
          <Skeleton className="h-52 rounded-md" />
          <Skeleton className="h-72 rounded-md" />
        </div>
      </div>
    </div>
  );
}
