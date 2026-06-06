import { redirect } from 'next/navigation';
import { hasCurrentUser } from '@/lib/auth-server';
import ProfilePage from './_components/ProfilePage';

type ProfileRoutePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProfileRoutePage({
  params,
}: ProfileRoutePageProps) {
  const { locale } = await params;

  if (!(await hasCurrentUser())) {
    redirect(`/${locale}/sign-in`);
  }

  return <ProfilePage />;
}
