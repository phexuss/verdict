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
    'Adventure',
    'Romance',
    'Thriller',
    'Comedy',
    'Drama',
    'Mystery',
    'Horror',
    'Sci-Fi',
    'Animation',
  ],
  ru: [
    'Приключения',
    'Романтика',
    'Триллер',
    'Комедия',
    'Драма',
    'Мистика',
    'Ужасы',
    'Фантастика',
    'Анимация',
  ],
};

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

const MOOD_POSITIONS_MOBILE: {
  bottom: string;
  left: string;
  accent: boolean;
  size: 'sm' | 'md';
  rotate?: number;
}[] = [
  { bottom: '15%', left: '10%', accent: false, size: 'sm', rotate: -7 },
  { bottom: '19%', left: '28%', accent: true, size: 'sm', rotate: -4 },
  { bottom: '22%', left: '46%', accent: false, size: 'sm', rotate: -1 },
  { bottom: '19%', left: '64%', accent: false, size: 'md', rotate: 0 },
  { bottom: '15%', left: '82%', accent: true, size: 'sm', rotate: 4 },
  { bottom: '7%', left: '22%', accent: false, size: 'sm', rotate: -3 },
  { bottom: '10%', left: '40%', accent: false, size: 'sm', rotate: -1 },
  { bottom: '10%', left: '60%', accent: true, size: 'sm', rotate: 1 },
  { bottom: '7%', left: '78%', accent: false, size: 'sm', rotate: 3 },
];

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('WelcomePage');

  const moods = locale === 'ru' ? MOODS.ru : MOODS.en;

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute right-0 top-1/3 z-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full blur-[120px]"
        style={{ background: 'var(--primary)', opacity: 0.07 }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[32svh] sm:h-[34svh] lg:hidden">
        {moods.map((mood, i) => {
          const pos = MOOD_POSITIONS_MOBILE[i];
          if (!pos) return null;

          return (
            <span
              key={mood}
              className="absolute whitespace-nowrap rounded-full border px-2 py-0.5 font-medium"
              style={{
                bottom: pos.bottom,
                left: pos.left,
                transform: `translateX(-50%) rotate(${pos.rotate ?? 0}deg)`,
                fontSize:
                  pos.size === 'sm'
                    ? 'clamp(0.56rem, 2.35vw, 0.67rem)'
                    : 'clamp(0.62rem, 2.7vw, 0.74rem)',
                opacity: pos.accent ? 0.56 : 0.26,
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
              <Link href={`/${locale}/sign-up`}>{t('cta')} →</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href={`/${locale}/browse`}>{t('browse')}</Link>
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
