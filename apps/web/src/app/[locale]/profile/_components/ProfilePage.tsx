'use client';

import {
  ChartBoldDuotone,
  ClapperboardOutline,
  ClockCircleLinear,
  SkipNextLinear,
  StarRainbowOutline,
} from '@solar-icons/react-perf';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useGetMyRecommendations } from '@/api/generated/recommendations/recommendations';
import {
  useGetCurrentUser,
  useGetTasteProfile,
  useGetUserMovies,
} from '@/api/generated/user/user';
import EmotionalWeightCard from '@/components/sections/profile/EmotionalWeightCard';
import IdentityCard from '@/components/sections/profile/IdentityCard';
import MoodCard from '@/components/sections/profile/MoodCard';
import PacingCard from '@/components/sections/profile/PacingCard';
import ProfileMovieShelfSummary from '@/components/sections/profile/ProfileMovieShelfSummary';
import RefreshTasteProfileCard from '@/components/sections/profile/RefreshTasteProfileCard';
import TonightHistory from '@/components/sections/profile/TonightHistory';
import { ProfileSkeleton } from './ProfileSkeleton';
import EmptyProfile from './EmptyProfile';

const ease = [0.22, 1, 0.36, 1] as const;

const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useGetCurrentUser({
    query: {
      retry: false,
      select: (response) => response.data,
    },
  });

  const { data: tasteProfile, isLoading: isProfileLoading } =
    useGetTasteProfile({
      query: {
        enabled: Boolean(user),
        retry: false,
        select: (response) => response.data,
      },
    });

  const { data: recommendations, isLoading: isRecommendationsLoading } =
    useGetMyRecommendations({
      query: {
        enabled: Boolean(user),
        retry: false,
        select: (response) => response.data,
      },
    });

  const { data: userMovies, isLoading: isUserMoviesLoading } = useGetUserMovies(
    {
      query: {
        enabled: Boolean(user),
        retry: false,
        select: (response) => response.data,
      },
    },
  );

  if (userError?.status === 401) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isUserLoading || isProfileLoading ? (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <ProfileSkeleton />
        </motion.div>
      ) : !tasteProfile?.data ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4 }}
        >
          <EmptyProfile markedCount={userMovies?.length ?? 0} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease }}
          className="mx-auto flex w-full max-w-7xl flex-col gap-10"
        >
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between md:gap-8"
          >
            <div className="flex min-w-0 flex-col gap-3">
              <h1 className="font-medium text-primary text-xs uppercase tracking-widest">
                {t('title')}
              </h1>
              <h2 className="wrap-break-word text-4xl font-semibold leading-tight tracking-tight md:text-5xl xl:text-6xl">
                {t('label')}
              </h2>
            </div>

            <div className="flex shrink-0 flex-row items-center gap-2 text-foreground/70 text-sm md:pb-2">
              <ChartBoldDuotone className="size-5 text-primary" />
              <p>
                {t('description', {
                  count: tasteProfile?.analyzedMovieCount ?? 0,
                })}
              </p>
            </div>
          </motion.header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.95fr)] lg:items-start">
            <motion.div
              variants={colVariants}
              initial="hidden"
              animate="show"
              className="flex min-w-0 flex-col gap-6"
            >
              <motion.div variants={itemVariants}>
                <MoodCard
                  highAffinity={tasteProfile.data.highAffinity}
                  lowAffinity={tasteProfile.data.lowAffinity}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid gap-4 sm:grid-cols-2"
              >
                {tasteProfile.data.identityCards.map((card, index) => (
                  <IdentityCard
                    key={`${card.title}-${card.description}`}
                    title={card.title}
                    description={card.description}
                    icon={
                      index === 1 ? (
                        <StarRainbowOutline className="size-8 shrink-0" />
                      ) : undefined
                    }
                  />
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col rounded-xl border border-foreground/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="mb-4 flex flex-row items-center gap-2 sm:mb-0">
                  <ClapperboardOutline className="size-6 shrink-0 text-primary" />
                  <h3 className="font-medium text-xl">
                    {t('Sections.FrequentlySeen.title')}
                  </h3>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed sm:text-right">
                  {tasteProfile.data.frequentlySeen.join(', ')}
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <RefreshTasteProfileCard />
              </motion.div>

              <motion.div variants={itemVariants}>
                <ProfileMovieShelfSummary
                  isLoading={isUserMoviesLoading}
                  movies={userMovies}
                />
              </motion.div>
            </motion.div>

            <motion.aside
              variants={colVariants}
              initial="hidden"
              animate="show"
              className="flex min-w-0 flex-col gap-6"
            >
              <motion.div variants={itemVariants}>
                <PacingCard pacing={tasteProfile.data.pacing} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <EmotionalWeightCard
                  emotionalWeight={tasteProfile.data.emotionalWeight}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
              >
                <div className="flex min-h-36 flex-col rounded-xl border border-foreground/8 bg-accent p-4">
                  <div className="mb-5 flex flex-row items-center gap-2">
                    <ClockCircleLinear className="size-6 shrink-0 text-primary" />
                    <h3 className="font-medium text-xl">
                      {t('Sections.Runtime.time')}
                    </h3>
                  </div>
                  <p className="font-medium text-base leading-tight">
                    {tasteProfile.data.runtimeRange.min} -{' '}
                    {tasteProfile.data.runtimeRange.max}
                    <span className="ml-1 text-foreground/70">
                      {t('Sections.Runtime.minutesSuffix')}
                    </span>
                  </p>
                </div>

                <div className="flex min-h-36 flex-col rounded-xl border border-foreground/8 bg-accent p-4">
                  <div className="mb-5 flex flex-row items-center gap-2">
                    <SkipNextLinear className="size-6 shrink-0 text-primary" />
                    <h3 className="font-medium text-xl">
                      {t('Sections.Runtime.skip')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tasteProfile.data.usuallySkip.slice(0, 3).map((item) => (
                      <span
                        className="inline-flex max-w-full rounded-full border border-border bg-background/40 px-3 py-1.5 text-foreground/70 text-sm leading-none"
                        key={item}
                      >
                        <span className="min-w-0 wrap-break-word">
                          {formatProfileLabel(item)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.aside>
          </div>

          <TonightHistory
            isLoading={isRecommendationsLoading}
            recommendations={recommendations}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatProfileLabel(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
}
