import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SignUpForm from '@/components/sections/auth/sign-up/SignUpForm';

type SignUpPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SignUpPage' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

export default async function SignUpPage() {
  const t = await getTranslations('SignUpPage');

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <header className="mb-5.5 flex flex-col items-start justify-start">
          <h1 className="font-medium text-xl">{t('title')}</h1>
          <p>{t('description')}</p>
        </header>
        <SignUpForm />
      </div>
    </div>
  );
}
