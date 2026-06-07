import { redirect } from 'next/navigation';
import { hasCurrentUser } from '@/lib/auth-server';
import ProfileMoviesPage from './_components/ProfileMoviesPage';

type ProfileMoviesRoutePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProfileMoviesRoutePage({
  params,
}: ProfileMoviesRoutePageProps) {
  const { locale } = await params;

  if (!(await hasCurrentUser())) {
    redirect(`/${locale}/sign-in`);
  }

  return <ProfileMoviesPage />;
}
