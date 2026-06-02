'use client';
import { useGetTasteProfile } from '@/api/generated/user/user';

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    error,
  } = useGetTasteProfile({
    query: {
      retry: false,
      select: (response) => response.data,
    },
  });

  if (isLoading) {
    return <div>Analyzing...</div>;
  }

  return <div></div>;
}
