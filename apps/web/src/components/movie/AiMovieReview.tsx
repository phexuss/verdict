'use client';

import { Button } from '@repo/ui/components/button';
import { StarBold } from '@solar-icons/react-perf';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { AiReviewResponseDto } from '@/api/generated/models';
import {
  useGenerateMovieAiReview,
  useGetMovieAiReview,
} from '@/api/generated/movies/movies';
import { AiMovieReviewCard } from './AiMovieReviewCard';
import { AiMovieReviewSkeleton } from './AiMovieReviewSkeleton';

const ease = [0.22, 1, 0.36, 1] as const;

type AiMovieReviewProps = {
  tmdbId: number;
  locale: string;
};

export function AiMovieReview({ tmdbId, locale }: AiMovieReviewProps) {
  const t = useTranslations('AiReview');
  const targetLocale = locale === 'ru' ? 'ru' : 'en';
  const [generatedReview, setGeneratedReview] =
    useState<AiReviewResponseDto | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const { data: existingReview, isLoading: isLoadingExisting } =
    useGetMovieAiReview(
      tmdbId,
      { locale: targetLocale },
      {
        query: {
          retry: false,
        },
      },
    );

  const {
    mutate,
    isPending: isGenerating,
    isError,
  } = useGenerateMovieAiReview({
    mutation: {
      onSuccess: (response) => {
        setGeneratedReview(response.data);
      },
      onError: (error: unknown) => {
        const err = error as {
          response?: { data?: { retryAfterSec?: number } };
        };
        const retryAfter = err?.response?.data?.retryAfterSec;
        if (retryAfter) {
          setRateLimitSeconds(retryAfter);
          setTimeout(() => setRateLimitSeconds(0), retryAfter * 1000);
        }
      },
    },
  });

  const handleGenerate = () => {
    mutate({
      tmdbId,
      data: { locale: targetLocale },
    });
  };

  const review = generatedReview ?? existingReview?.data ?? null;

  if (review) {
    return <AiMovieReviewCard review={review} />;
  }

  if (isLoadingExisting) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/10 p-5 shadow-[0_0_0_1px_oklch(0.76_0.13_65/0.04)]"
    >
      <div className="flex items-center gap-2 text-primary">
        <StarBold className="size-5 shrink-0" />
        <h2 className="font-medium text-xl">{t('title')}</h2>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AiMovieReviewSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            <p className="text-foreground/60 text-sm leading-relaxed">
              {t('generateHint')}
            </p>

            {isError && (
              <p className="text-destructive text-sm">
                {rateLimitSeconds > 0
                  ? t('rateLimited', { seconds: rateLimitSeconds })
                  : t('error')}
              </p>
            )}

            <Button
              onClick={handleGenerate}
              variant="outline"
              className="w-fit border-primary/30 text-primary hover:bg-primary/15 hover:text-primary"
            >
              <StarBold className="size-4" />
              {isError ? t('retry') : t('generateButton')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
