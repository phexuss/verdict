'use client';

import {
  ChartBoldDuotone,
  ClapperboardOutline,
  ClockCircleLinear,
  SkipNextLinear,
  StarRainbowOutline,
} from '@solar-icons/react-perf';
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

  if (isUserLoading || isProfileLoading) {
    return <ProfileSkeleton />;
  }

  const profile = tasteProfile?.data;

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <header className="flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="font-medium text-primary text-sm uppercase tracking-widest">
            {t('title')}
          </h1>
          <h2 className="wrap-break-word text-4xl leading-tight md:text-5xl xl:text-6xl">
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
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.95fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <MoodCard
            highAffinity={profile.highAffinity}
            lowAffinity={profile.lowAffinity}
          />

          <div className="grid items-start gap-4 sm:grid-cols-2">
            {profile.identityCards.map((card, index) => (
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
          </div>

          <div className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="mb-4 flex flex-row items-center gap-2 sm:mb-0">
              <ClapperboardOutline className="size-6 shrink-0 text-primary" />
              <h3 className="font-medium text-xl">
                {t('Sections.FrequentlySeen.title')}
              </h3>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed sm:text-right">
              {profile.frequentlySeen.join(', ')}
            </p>
          </div>

          <RefreshTasteProfileCard />

          <ProfileMovieShelfSummary
            isLoading={isUserMoviesLoading}
            movies={userMovies}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <PacingCard pacing={profile.pacing} />

          <EmotionalWeightCard emotionalWeight={profile.emotionalWeight} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="flex min-h-36 flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
              <div className="mb-5 flex flex-row items-center gap-2">
                <ClockCircleLinear className="size-6 shrink-0 text-primary" />
                <h3 className="font-medium text-xl">
                  {t('Sections.Runtime.time')}
                </h3>
              </div>

              <p className="font-medium text-base leading-tight">
                {profile.runtimeRange.min} - {profile.runtimeRange.max}
                <span className="ml-1 text-foreground/70">
                  {t('Sections.Runtime.minutesSuffix')}
                </span>
              </p>
            </div>

            <div className="flex min-h-36 flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
              <div className="mb-5 flex flex-row items-center gap-2">
                <SkipNextLinear className="size-6 shrink-0 text-primary" />
                <h3 className="font-medium text-xl">
                  {t('Sections.Runtime.skip')}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.usuallySkip.slice(0, 3).map((item) => (
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
          </div>
        </aside>
      </div>

      <TonightHistory
        isLoading={isRecommendationsLoading}
        recommendations={recommendations}
      />
    </div>
  );
}

function formatProfileLabel(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return trimmedValue;
  }

  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
}
