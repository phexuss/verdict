'use client';

import { toast } from '@repo/ui/components/sonner';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import {
  useGetCurrentUser,
  useGetTasteProfile,
} from '@/api/generated/user/user';
import { useRouter } from '@/i18n/navigation';
import { ProfileSkeleton } from './_components/ProfileSkeleton';

export default function ProfilePage() {
  const alerts = useTranslations('Alerts');
  const router = useRouter();

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

  useEffect(() => {
    if (userError?.status === 401) {
      toast.info(alerts('signInRequired'), {
        id: 'sign-in-required',
        duration: 5000,
      });
      router.replace('/sign-in');
    }
  }, [alerts, userError, router]);

  const { isLoading: isProfileLoading } = useGetTasteProfile({
    query: {
      enabled: Boolean(user),
      retry: false,
      select: (response) => response.data,
    },
  });

  if (isUserLoading || userError?.status === 401) {
    return null;
  }

  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return <div>{user?.name}</div>;
}
