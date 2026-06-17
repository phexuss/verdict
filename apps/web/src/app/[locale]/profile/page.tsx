import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { hasCurrentUser } from '@/lib/auth-server';
import ProfilePage from './_components/ProfilePage';

type ProfileRoutePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ProfileRoutePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProfilePage' });
  return {
    title: t('label'),
    description: t('description', { count: 0 }),
    robots: { index: false, follow: false },
  };
}

export default async function ProfileRoutePage({
  params,
}: ProfileRoutePageProps) {
  const { locale } = await params;

  if (!(await hasCurrentUser())) {
    redirect(`/${locale}/sign-in`);
  }

  return <ProfilePage />;
}
