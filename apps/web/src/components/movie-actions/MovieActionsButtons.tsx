'use client';
import { Button } from '@repo/ui/components/button';
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
import {
  getGetUserMoviesQueryKey,
  useGetUserMovies,
  useUpdateUserMovie,
} from '@/api/generated/user/user';

interface MovieActionsButtonsProps {
  tmdbId: number;
}

export default function MovieActionsButtons({
  tmdbId,
}: MovieActionsButtonsProps) {
  const t = useTranslations('MovieActionsBar');
  const queryClient = useQueryClient();
  const { data: userMovies } = useGetUserMovies({
    query: {
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

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        className={isWanted ? undefined : outlineHoverClassName}
        disabled={isPending}
        variant={isWanted ? 'default' : 'outline'}
        onClick={() => {
          updateMovie.mutate({
            tmdbId,
            data: {
              saved: !isWanted,
            },
          });
        }}
      >
        {isWanted ? (
          <div className="flex flex-row gap-2 items-center">
            <BookmarkBold className="size-4" />
            {t('want')}
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <BookmarkOutline className="size-4" />
            {t('want')}
          </div>
        )}
      </Button>

      <Button
        className={isWatched ? undefined : outlineHoverClassName}
        disabled={isPending}
        variant={isWatched ? 'default' : 'outline'}
        onClick={() => {
          updateMovie.mutate({
            tmdbId,
            data: {
              watched: !isWatched,
            },
          });
        }}
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
        onClick={() => {
          updateMovie.mutate({
            tmdbId,
            data: {
              reaction: isDisliked ? null : 'DISLIKED',
            },
          });
        }}
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
          >
            <StarBold className="size-4" />
            {rating ? t('rating', { rating }) : t('rate')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          <DropdownMenuLabel>{t('rate')}</DropdownMenuLabel>
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
            <DropdownMenuItem
              className="justify-between"
              disabled={isPending}
              key={value}
              onClick={() => {
                updateMovie.mutate({
                  tmdbId,
                  data: {
                    rating: value,
                    watched: true,
                  },
                });
              }}
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
                onClick={() => {
                  updateMovie.mutate({
                    tmdbId,
                    data: {
                      rating: null,
                    },
                  });
                }}
              >
                {t('clearRating')}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
