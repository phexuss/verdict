import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { GenreMenu } from '@/components/sections/tonight/GenreMenu';

type TonightPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: TonightPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TonightPage' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} — Verdict`,
      description: t('description'),
    },
  };
}

export default function TonightPage() {
  const t = useTranslations('TonightPage');
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 40% at 50% -5%, oklch(0.76 0.13 65 / 0.13) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at -5% 30%, oklch(0.76 0.13 65 / 0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 50% at 105% 30%, oklch(0.76 0.13 65 / 0.07) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 md:pt-18 lg:px-8">
        <div className="flex w-full max-w-3xl flex-col items-center pb-2 text-center">
          <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground/80 md:text-lg">
            {t('description')}
          </p>
        </div>

        <GenreMenu />
      </main>
    </div>
  );
}
