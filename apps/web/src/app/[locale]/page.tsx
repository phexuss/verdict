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
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute right-0 top-1/3 z-0 h-125 w-125 -translate-y-1/2 translate-x-1/3 rounded-full blur-[120px]"
        style={{ background: 'var(--primary)', opacity: 0.07 }}
      />

      <FloatingMoods moods={moods} />

      <main className="relative z-20 flex flex-1 flex-col justify-center px-6 pb-8 pt-20 md:px-16 md:pt-24 md:pb-10 lg:px-24 lg:py-24">
        <div className="max-w-xl">
          <WelcomeTitle className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            {t.rich('title', {
              chunk: (chunks) => <AnimatedChunk>{chunks}</AnimatedChunk>,
              accent: (chunks) => (
                <em
                  className="not-italic"
                  style={{ color: 'var(--primary)', fontStyle: 'italic' }}
                >
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
