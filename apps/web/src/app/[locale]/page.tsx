import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BrowseButton from '@/components/motion/welcome/BrowseButtton';
import { FloatingMoods } from '@/components/motion/welcome/FloatingMoods';
import GetStartedButton from '@/components/motion/welcome/GetStartedButton';
import {
  AnimatedChunk,
  AnimatedDescription,
  WelcomeTitle,
} from '@/components/motion/welcome/WelcomeTitle';
import { routing } from '@/i18n/routing';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
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

const ACCENT_INDEXES = new Set([1, 4, 7]);

const MOOD_POSITIONS: {
  top: string;
  right: string;
  accent: boolean;
  size: 'sm' | 'md';
}[] = [
  { top: '14%', right: '12%', accent: false, size: 'md' },
  { top: '22%', right: '28%', accent: true, size: 'sm' },
  { top: '31%', right: '7%', accent: false, size: 'sm' },
  { top: '40%', right: '20%', accent: false, size: 'md' },
  { top: '48%', right: '34%', accent: true, size: 'sm' },
  { top: '55%', right: '9%', accent: false, size: 'md' },
  { top: '62%', right: '23%', accent: false, size: 'sm' },
  { top: '70%', right: '15%', accent: true, size: 'md' },
  { top: '78%', right: '5%', accent: false, size: 'sm' },
];

function MoodChip({
  label,
  accent,
  size = 'md',
}: {
  label: string;
  accent: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 whitespace-nowrap rounded-full border font-medium"
      style={{
        padding: size === 'sm' ? '0.25rem 0.75rem' : '0.35rem 0.9rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
        opacity: accent ? 0.65 : 0.3,
        borderColor: accent
          ? 'var(--primary)'
          : 'color-mix(in oklch, var(--foreground) 20%, transparent)',
        color: accent ? 'var(--primary)' : 'var(--muted-foreground)',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('WelcomePage');

  const moods = locale === 'ru' ? MOODS.ru : MOODS.en;

  const rowA = [...moods, ...moods];
  const rowB = [...moods.slice().reverse(), ...moods.slice().reverse()];

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-left { animation: marquee-left 38s linear infinite; }
        .marquee-right { animation: marquee-right 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right { animation: none; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute right-0 top-1/3 z-0 h-125 w-125 -translate-y-1/2 translate-x-1/3 rounded-full blur-[120px]"
        style={{ background: 'var(--primary)', opacity: 0.07 }}
      />

      <FloatingMoods moods={moods} positions={MOOD_POSITIONS} />

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

      <div
        className="pointer-events-none z-10 flex flex-col gap-3 overflow-hidden py-5 pb-6 lg:hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div className="marquee-left flex w-max gap-3">
          {rowA.map((mood, i) => (
            <MoodChip
              key={`rowA-${mood}-${Math.floor(i / moods.length)}`}
              label={mood}
              accent={ACCENT_INDEXES.has(i % moods.length)}
              size="sm"
            />
          ))}
        </div>
        <div className="marquee-right flex w-max gap-3">
          {rowB.map((mood, i) => (
            <MoodChip
              key={`rowB-${mood}-${Math.floor(i / moods.length)}`}
              label={mood}
              accent={ACCENT_INDEXES.has(i % moods.length)}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
