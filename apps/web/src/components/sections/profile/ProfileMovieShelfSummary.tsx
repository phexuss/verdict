'use client';

import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookmarkBold } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import type { UserMovieActionDto } from '@/api/generated/models';
import { Link } from '@/i18n/navigation';
import { hasMovieAction } from './ProfileMovieShelf';

type ProfileMovieShelfSummaryProps = {
  movies?: UserMovieActionDto[];
  isLoading?: boolean;
};

export default function ProfileMovieShelfSummary({
  movies,
  isLoading,
}: ProfileMovieShelfSummaryProps) {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const markedMovieCount = movies?.filter(hasMovieAction).length ?? 0;

  return (
    <section className="flex flex-col gap-4 rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <BookmarkBold className="size-6 shrink-0 text-primary" />
          <h3 className="font-medium text-xl">{t('title')}</h3>
        </div>
        <p className="text-foreground/70 text-sm leading-relaxed">
          {t('description')}
        </p>
        {isLoading ? (
          <Skeleton className="mt-3 h-4 w-36 rounded-sm" />
        ) : (
          <p className="mt-3 font-medium text-primary text-sm">
            {markedMovieCount > 0
              ? t('count', { count: markedMovieCount })
              : t('countEmpty')}
          </p>
        )}
      </div>

      <Button asChild className="w-full sm:w-auto">
        <Link href="/profile/movies">{t('open')}</Link>
      </Button>
    </section>
  );
}
