'use client';

import {
  ChartBoldDuotone,
  ClapperboardOutline,
  StarRainbowOutline,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import {
  useGetCurrentUser,
  useGetTasteProfile,
} from '@/api/generated/user/user';
import EmotionalWeightCard from '@/components/sections/profile/EmotionalWeightCard';
import IdentityCard from '@/components/sections/profile/IdentityCard';
import MoodCard from '@/components/sections/profile/MoodCard';
import PacingCard from '@/components/sections/profile/PacingCard';
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

  if (userError?.status === 401) {
    return null;
  }

  if (isUserLoading || isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-sm uppercase">{t('title')}</h1>
        <h2 className="text-3xl">{t('label')}</h2>
        <div className="flex flex-row items-center gap-2">
          <ChartBoldDuotone />
          <p>
            {t('description', {
              count: tasteProfile?.analyzedMovieCount ?? 0,
            })}
          </p>
        </div>
      </div>

      <MoodCard
        highAffinity={tasteProfile?.data.highAffinity ?? []}
        lowAffinity={tasteProfile?.data.lowAffinity ?? []}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {tasteProfile?.data.identityCards.map((card, index) => (
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
      <div className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
        <div className="mb-5 flex flex-row items-center gap-2">
          <ClapperboardOutline className="size-6 shrink-0 text-primary" />
          <h3 className="font-medium text-xl">
            {t('Sections.FrequentlySeen.title')}
          </h3>
        </div>
        <p className="text-foreground/70 text-sm leading-relaxed">
          {tasteProfile?.data.frequentlySeen.join(', ')}
        </p>
      </div>

      {tasteProfile?.data.pacing && (
        <PacingCard pacing={tasteProfile.data.pacing} />
      )}

      {tasteProfile?.data.emotionalWeight && (
        <EmotionalWeightCard
          emotionalWeight={tasteProfile.data.emotionalWeight}
        />
      )}
    </div>
  );
}
