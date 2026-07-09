import { Skeleton } from '@repo/ui/components/skeleton';
import { useTranslations } from 'next-intl';

export function AiMovieReviewSkeleton() {
  const t = useTranslations('AiReview');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-3/4 bg-primary/10" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-primary/10" />
        <Skeleton className="h-4 w-5/6 bg-primary/10" />
        <Skeleton className="h-4 w-2/3 bg-primary/10" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full bg-primary/15" />
        <Skeleton className="h-6 w-24 rounded-full bg-primary/15" />
        <Skeleton className="h-6 w-16 rounded-full bg-primary/15" />
      </div>
      <p className="text-primary/60 text-xs">{t('generating')}</p>
    </div>
  );
}
