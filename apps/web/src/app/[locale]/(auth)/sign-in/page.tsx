import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SignInForm from '@/components/sections/auth/sign-in/SignInForm';

type SignInPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SignInPage' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage() {
  const t = await getTranslations('SignInPage');
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="surface w-full max-w-md rounded-4xl p-6 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_24px_60px_-24px_oklch(0_0_0/0.8),0_0_80px_-40px_oklch(0.76_0.13_65/0.5)] sm:p-8">
        <header className="flex items-start justify-start flex-col mb-5.5">
          <h1 className="text-xl font-medium">{t('title')}</h1>
          <p>{t('description')}</p>
        </header>
        <SignInForm />
      </div>
    </div>
  );
}
