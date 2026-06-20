import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { hasCurrentUser } from '@/lib/auth-server';
import ProfileMoviesPage from './_components/ProfileMoviesPage';

type ProfileMoviesRoutePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfileMoviesRoutePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProfilePage' });
  return {
    title: locale === 'ru' ? 'Мои фильмы' : 'My Films',
    description: t('label'),
    robots: { index: false, follow: false },
  };
}

export default async function ProfileMoviesRoutePage({
  params,
}: ProfileMoviesRoutePageProps) {
  const { locale } = await params;

  if (!(await hasCurrentUser())) {
    redirect(`/${locale}/sign-in`);
  }

  return <ProfileMoviesPage />;
}
