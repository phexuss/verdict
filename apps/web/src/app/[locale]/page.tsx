import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BrowseButton from '@/components/motion/welcome/BrowseButtton';
import { FloatingMoods } from '@/components/motion/welcome/FloatingMoods';
import GetStartedButton from '@/components/motion/welcome/GetStartedButton';
import { MoodMarquee } from '@/components/motion/welcome/MoodMarquee';
import {
  AnimatedChunk,
  AnimatedDescription,
  WelcomeTitle,
} from '@/components/motion/welcome/WelcomeTitle';
import TestImdbImportButton from '@/components/TestImdbImportButton';
import { routing } from '@/i18n/routing';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WelcomePage' });
  return {
    description: t('description'),
    openGraph: { title: 'Verdict', description: t('description') },
  };
}

const MOODS = {
  en: [
    'Dark',
    'Tense',
    'Weird',
    'Atmospheric',
    'Comfort',
    'Smart',
    'Fast',
    'Emotional',
    'Funny',
  ],
  ru: [
    'Тёмный',
    'Напряжённый',
    'Странный',
    'Атмосферный',
    'Уютный',
    'Глубокий',
    'Динамичный',
    'Трогательный',
    'Смешной',
  ],
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('WelcomePage');

  const moods = locale === 'ru' ? MOODS.ru : MOODS.en;

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/3 right-0 h-125 w-125 translate-x-1/3 -translate-y-1/2 animate-aurora rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -top-24 left-1/4 h-80 w-80 animate-aurora-slow rounded-full bg-[oklch(0.62_0.15_40/0.09)] blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-72 w-[60%] -translate-x-1/4 translate-y-1/3 animate-aurora rounded-full bg-primary/6 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(oklch(1_0_0/0.05)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_30%_45%,black,transparent)] bg-size-[28px_28px]" />
      </div>

      <FloatingMoods moods={moods} />

      <main className="relative z-20 flex flex-1 flex-col justify-center px-6 pb-8 pt-20 md:px-16 md:pt-24 md:pb-10 lg:px-24 lg:py-24">
        <div className="max-w-xl">
          <WelcomeTitle className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            {t.rich('title', {
              chunk: (chunks) => <AnimatedChunk>{chunks}</AnimatedChunk>,
              accent: (chunks) => (
                <em className="text-gold animate-text-shine pr-1 italic">
                  {chunks}
                </em>
              ),
            })}
          </WelcomeTitle>

          <AnimatedDescription
            className="mb-7 max-w-md text-base leading-relaxed sm:mb-10 md:text-lg text-muted-foreground"
            translations={t('description')}
          ></AnimatedDescription>

          <div className="flex flex-wrap items-center gap-3">
            <GetStartedButton translations={t('cta')} href={`/tonight`} />
            <BrowseButton translations={t('browse')} href={`/curated`} />
          </div>
        </div>
      </main>

      <MoodMarquee moods={moods} />
    </div>
  );
}
