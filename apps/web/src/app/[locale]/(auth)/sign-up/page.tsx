import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SignUpForm from '@/components/sections/auth/sign-up/SignUpForm';

type SignUpPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: SignUpPageProps): Promise<Metadata> {
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
      <div className="surface w-full max-w-md rounded-4xl p-6 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_24px_60px_-24px_oklch(0_0_0/0.8),0_0_80px_-40px_oklch(0.76_0.13_65/0.5)] sm:p-8">
        <header className="mb-5.5 flex flex-col items-start justify-start">
          <h1 className="font-medium text-xl">{t('title')}</h1>
          <p>{t('description')}</p>
        </header>
        <SignUpForm />
      </div>
    </div>
  );
}
