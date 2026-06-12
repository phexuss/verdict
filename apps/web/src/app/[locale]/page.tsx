import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

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
    <div className="relative min-h-svh overflow-hidden bg-background">
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

      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {moods.map((mood, i) => {
          const pos = MOOD_POSITIONS[i];
          if (!pos) return null;

          return (
            <span
              key={mood}
              className="absolute rounded-full border px-3 py-1 font-medium"
              style={{
                top: pos.top,
                right: pos.right,
                fontSize:
                  pos.size === 'sm'
                    ? 'clamp(0.6rem, 1.8vw, 0.7rem)'
                    : 'clamp(0.7rem, 2vw, 0.8rem)',
                opacity: pos.accent ? 0.55 : 0.25,
                borderColor: pos.accent
                  ? 'var(--primary)'
                  : 'color-mix(in oklch, var(--foreground) 20%, transparent)',
                color: pos.accent
                  ? 'var(--primary)'
                  : 'var(--muted-foreground)',
                letterSpacing: '0.02em',
              }}
            >
              {mood}
            </span>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-15 z-10 flex flex-col gap-3 overflow-hidden py-6 lg:hidden"
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

      <main className="relative z-20 flex min-h-svh flex-col justify-center px-6 pb-44 pt-24 md:px-16 lg:px-24 lg:py-24">
        <div className="max-w-xl">
          <div className="mb-8 flex items-center gap-3">
            <div
              className="h-px w-8"
              style={{ background: 'var(--primary)' }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: 'var(--primary)' }}
            >
              Verdict
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t.rich('title', {
              accent: (chunks) => (
                <em
                  className="not-italic"
                  style={{ color: 'var(--primary)', fontStyle: 'italic' }}
                >
                  {chunks}
                </em>
              ),
            })}
          </h1>

          <p
            className="mb-10 max-w-md text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {t('description')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href={`/${locale}/tonight`}>{t('cta')} →</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href={`/${locale}/curated`}>{t('browse')}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
