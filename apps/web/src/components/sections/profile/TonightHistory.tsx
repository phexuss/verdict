'use client';

import { Skeleton } from '@repo/ui/components/skeleton';
import { ArrowRightLinear, VideoFrameLinear } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { RecommendationListItemDto } from '@/api/generated/models';
import { Link } from '@/i18n/navigation';

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

type TonightHistoryProps = {
  recommendations?: RecommendationListItemDto[];
  isLoading?: boolean;
};

const POSTER_PLACEHOLDER_KEYS = [
  'poster-placeholder-1',
  'poster-placeholder-2',
  'poster-placeholder-3',
] as const;

export default function TonightHistory({
  recommendations,
  isLoading,
}: TonightHistoryProps) {
  const t = useTranslations('ProfilePage.Sections.TonightHistory');
  const locale = useLocale();
  const hasRecommendations = Boolean(recommendations?.length);

  return (
    <section className="border-border border-t pt-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            <VideoFrameLinear className="size-6 shrink-0 text-primary" />
            <h3 className="font-medium text-2xl">{t('title')}</h3>
          </div>
          <p className="max-w-2xl text-foreground/70 text-sm leading-relaxed">
            {t('description')}
          </p>
        </div>

        <Link
          className="inline-flex w-fit items-center gap-1.5 font-medium text-primary text-sm transition-colors hover:text-primary/80"
          href="/tonight"
        >
          {t('cta')}
          <ArrowRightLinear className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {isLoading ? (
        <TonightHistorySkeleton />
      ) : hasRecommendations ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {recommendations?.map((recommendation) => (
            <motion.div
              key={recommendation.id}
              variants={itemVariants}
              className="h-full"
            >
              <RecommendationCard
                locale={locale}
                recommendation={recommendation}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-xl border border-foreground/8 bg-accent p-5">
          <p className="font-medium text-lg">{t('emptyTitle')}</p>
          <p className="mt-2 max-w-2xl text-foreground/70 text-sm leading-relaxed">
            {t('emptyDescription')}
          </p>
        </div>
      )}
    </section>
  );
}

type RecommendationCardProps = {
  recommendation: RecommendationListItemDto;
  locale: string;
};

function RecommendationCard({
  recommendation,
  locale,
}: RecommendationCardProps) {
  const t = useTranslations('ProfilePage.Sections.TonightHistory');
  const title = recommendation.title ?? t('fallbackTitle');
  const date = formatDate(recommendation.createdAt, locale);

  return (
    <Link
      className="group flex h-full min-h-52 flex-col overflow-hidden rounded-xl border border-foreground/8 bg-accent ring-1 ring-foreground/5 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_-8px_oklch(0.76_0.13_65/0.18)]"
      href={`/tonight/${recommendation.slug}`}
    >
      <div className="grid h-28 grid-cols-3 gap-1 overflow-hidden bg-background/40 p-1">
        {recommendation.movies.slice(0, 3).map((movie) => (
          <PosterPreview
            key={`${recommendation.id}-${movie.tmdbId}`}
            movie={movie}
          />
        ))}
        {POSTER_PLACEHOLDER_KEYS.slice(
          0,
          Math.max(0, 3 - recommendation.movies.length),
        ).map((key) => (
          <div
            className="rounded-sm bg-muted"
            key={`${recommendation.id}-${key}`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-foreground/50 text-xs">{date}</p>
            <h4 className="line-clamp-2 wrap-break-word font-medium text-lg leading-tight">
              {title}
            </h4>
          </div>

          <ArrowRightLinear className="mt-1 size-5 shrink-0 text-primary opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>

        {recommendation.description ? (
          <p className="line-clamp-2 text-foreground/70 text-sm leading-relaxed">
            {recommendation.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2">
          {recommendation.moods.slice(0, 3).map((mood) => (
            <span
              className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-foreground/80 text-xs leading-none"
              key={mood}
            >
              {formatLabel(mood)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

type PosterPreviewProps = {
  movie: RecommendationListItemDto['movies'][number];
};

function PosterPreview({ movie }: PosterPreviewProps) {
  const imagePath = movie.posterPath ?? movie.backdropPath;

  if (!imagePath) {
    return (
      <div className="flex items-center justify-center rounded-sm bg-muted p-2 text-center text-muted-foreground text-xs">
        {movie.title}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-sm bg-muted">
      <Image
        alt={movie.title ?? ''}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        fill
        sizes="(min-width: 1280px) 10vw, (min-width: 768px) 16vw, 30vw"
        src={`https://image.tmdb.org/t/p/w342${imagePath}`}
      />
    </div>
  );
}

function TonightHistorySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {['tonight-history-1', 'tonight-history-2', 'tonight-history-3'].map(
        (item) => (
          <article
            className="min-h-52 overflow-hidden rounded-xl border border-foreground/8 bg-accent"
            key={item}
          >
            <div className="grid h-28 grid-cols-3 gap-1 bg-background/40 p-1">
              <Skeleton className="h-full rounded-sm" />
              <Skeleton className="h-full rounded-sm" />
              <Skeleton className="h-full rounded-sm" />
            </div>
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-6 w-4/5 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-3/4 rounded-sm" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </article>
        ),
      )}
    </div>
  );
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

function formatLabel(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
}
