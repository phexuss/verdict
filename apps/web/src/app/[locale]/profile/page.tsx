'use client';

import { useGetTasteProfile } from '@/api/generated/user/user';
import { ProfileSkeleton } from './_components/ProfileSkeleton';

export default function ProfilePage() {
  const { isLoading } = useGetTasteProfile({
    query: {
      retry: false,
      select: (response) => response.data,
    },
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return <div></div>;
}
