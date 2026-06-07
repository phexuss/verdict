'use client';

import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { ArrowLeftLinear, BookmarkBold } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import { useGetUserMovies } from '@/api/generated/user/user';
import ProfileMovieShelf, {
  hasMovieAction,
} from '@/components/sections/profile/ProfileMovieShelf';
import { Link } from '@/i18n/navigation';

export default function ProfileMoviesPage() {
  const t = useTranslations('ProfilePage.Sections.MovieShelf');
  const { data: userMovies, isLoading } = useGetUserMovies({
    query: {
      retry: false,
      select: (response) => response.data,
    },
  });
  const markedMovieCount = userMovies?.filter(hasMovieAction).length ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-5 border-border border-b pb-6">
        <Button asChild className="w-fit -ml-3" variant="ghost">
          <Link href="/profile">
            <ArrowLeftLinear className="size-4" />
            {t('back')}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <BookmarkBold className="size-8 shrink-0 text-primary" />
              <h1 className="wrap-break-word text-4xl leading-tight md:text-5xl xl:text-6xl">
                {t('title')}
              </h1>
            </div>
            <p className="mt-3 max-w-2xl text-foreground/70 text-base leading-relaxed">
              {t('description')}
            </p>
          </div>

          {isLoading ? (
            <Skeleton className="h-5 w-40 rounded-sm" />
          ) : (
            <p className="font-medium text-primary text-sm md:pb-2">
              {markedMovieCount > 0
                ? t('count', { count: markedMovieCount })
                : t('countEmpty')}
            </p>
          )}
        </div>
      </header>

      <ProfileMovieShelf
        isLoading={isLoading}
        movies={userMovies}
        variant="page"
      />
    </div>
  );
}
