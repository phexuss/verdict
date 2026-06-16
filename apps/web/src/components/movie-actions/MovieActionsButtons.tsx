'use client';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  BookmarkBold,
  BookmarkOutline,
  DislikeBold,
  DislikeOutline,
  EyeClosedLinear,
  EyeLinear,
  StarBold,
} from '@solar-icons/react-perf';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  getGetUserMoviesQueryKey,
  useGetCurrentUser,
  useGetUserMovies,
  useUpdateUserMovie,
} from '@/api/generated/user/user';
import { Link } from '@/i18n/navigation';
import GoogleLoginButton from '@/components/sections/auth/sign-in/GoogleLoginButton';

interface MovieActionsButtonsProps {
  tmdbId: number;
}

export default function MovieActionsButtons({
  tmdbId,
}: MovieActionsButtonsProps) {
  const t = useTranslations('MovieActionsBar');
  const ta = useTranslations('Alerts');
  const queryClient = useQueryClient();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const { data: user } = useGetCurrentUser({
    query: {
      retry: false,
      select: (res) => res.data,
    },
  });

  const isAuthenticated = Boolean(user);

  const { data: userMovies } = useGetUserMovies({
    query: {
      enabled: isAuthenticated,
      select: (response) => response.data,
    },
  });

  const action = userMovies?.find((item) => item.tmdbId === tmdbId);
  const isWanted = Boolean(action?.savedAt);
  const isWatched = Boolean(action?.watchedAt);
  const isDisliked = action?.reaction === 'DISLIKED';
  const rating = action?.rating ?? null;

  const outlineHoverClassName =
    'hover:border-primary/35 hover:bg-primary/5 dark:hover:bg-primary/10';
  const dislikeOutlineHoverClassName =
    'hover:border-destructive/35 hover:bg-destructive/5 hover:text-destructive dark:hover:bg-destructive/10';

  const updateMovie = useUpdateUserMovie({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetUserMoviesQueryKey(),
        });
      },
    },
  });

  const isPending = updateMovie.isPending;

  function guardedAction(fn: () => void) {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    fn();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className={isWanted ? undefined : outlineHoverClassName}
          disabled={isPending}
          variant={isWanted ? 'default' : 'outline'}
          onClick={() =>
            guardedAction(() =>
              updateMovie.mutate({ tmdbId, data: { saved: !isWanted } }),
            )
          }
        >
          <div className="flex flex-row gap-2 items-center">
            {isWanted ? (
              <BookmarkBold className="size-4" />
            ) : (
              <BookmarkOutline className="size-4" />
            )}
            {t('want')}
          </div>
        </Button>

        <Button
          className={isWatched ? undefined : outlineHoverClassName}
          disabled={isPending}
          variant={isWatched ? 'default' : 'outline'}
          onClick={() =>
            guardedAction(() =>
              updateMovie.mutate({ tmdbId, data: { watched: !isWatched } }),
            )
          }
        >
          <div className="flex flex-row items-center gap-2">
            {isWatched ? (
              <EyeLinear className="size-4" />
            ) : (
              <EyeClosedLinear className="size-4" />
            )}
            {t('watched')}
          </div>
        </Button>

        <Button
          className={isDisliked ? undefined : dislikeOutlineHoverClassName}
          disabled={isPending}
          variant={isDisliked ? 'destructive' : 'outline'}
          onClick={() =>
            guardedAction(() =>
              updateMovie.mutate({
                tmdbId,
                data: { reaction: isDisliked ? null : 'DISLIKED' },
              }),
            )
          }
        >
          <div className="flex flex-row items-center gap-2">
            {isDisliked ? (
              <DislikeBold className="size-4" />
            ) : (
              <DislikeOutline className="size-4" />
            )}
            {isDisliked ? t('disliked') : t('dislike')}
          </div>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={rating ? undefined : outlineHoverClassName}
              disabled={isPending}
              variant={rating ? 'default' : 'outline'}
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthPromptOpen(true);
                }
              }}
            >
              <StarBold className="size-4" />
              {rating ? t('rating', { rating }) : t('rate')}
            </Button>
          </DropdownMenuTrigger>
          {isAuthenticated && (
            <DropdownMenuContent align="start" className="min-w-44">
              <DropdownMenuLabel>{t('rate')}</DropdownMenuLabel>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                <DropdownMenuItem
                  className="justify-between"
                  disabled={isPending}
                  key={value}
                  onClick={() =>
                    updateMovie.mutate({
                      tmdbId,
                      data: { rating: value, watched: true },
                    })
                  }
                >
                  <span>{t('rating', { rating: value })}</span>
                  {rating === value ? <StarBold className="size-4" /> : null}
                </DropdownMenuItem>
              ))}
              {rating ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isPending}
                    variant="destructive"
                    onClick={() =>
                      updateMovie.mutate({ tmdbId, data: { rating: null } })
                    }
                  >
                    {t('clearRating')}
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>

      <Dialog open={authPromptOpen} onOpenChange={setAuthPromptOpen}>
        <DialogContent className="max-w-sm border-border bg-background p-6">
          <DialogHeader className="gap-2 text-center items-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-2xl">
              🎬
            </div>
            <DialogTitle className="text-xl font-semibold">
              {ta('authPromptTitle')}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {ta('authPromptDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-3">
            <GoogleLoginButton />
            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">или</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex gap-2">
              <Link
                href="/sign-in"
                className="flex-1 inline-flex justify-center items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setAuthPromptOpen(false)}
              >
                {ta('authPromptSignIn')}
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                onClick={() => setAuthPromptOpen(false)}
              >
                {ta('authPromptSignUp')}
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
