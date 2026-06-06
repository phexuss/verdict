'use client';

import { ChartBoldDuotone } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import {
  useGetCurrentUser,
  useGetTasteProfile,
} from '@/api/generated/user/user';
import MoodCard from '@/components/sections/profile/MoodCard';
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
    </div>
  );
}
