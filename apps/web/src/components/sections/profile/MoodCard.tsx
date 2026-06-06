'use client';

import { StickerSmileCircleOutline } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import type { TasteProfileDataDto } from '@/api/generated/models';

type MoodCardProps = Pick<TasteProfileDataDto, 'highAffinity' | 'lowAffinity'>;

export default function MoodCard({ highAffinity, lowAffinity }: MoodCardProps) {
  const t = useTranslations('ProfilePage.Sections.Atmosphere');

  return (
    <div className="flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <div className="mb-5 flex flex-row items-center gap-2">
        <StickerSmileCircleOutline className="size-6 shrink-0" />
        <h3 className="text-xl">{t('title')}</h3>
      </div>

      <div className="flex flex-col gap-6">
        <MoodGroup
          label={t('highaff')}
          moods={highAffinity}
          sign="+"
          variant="high"
        />
        <MoodGroup
          label={t('lowaff')}
          moods={lowAffinity}
          sign="-"
          variant="low"
        />
      </div>
    </div>
  );
}

type MoodGroupProps = {
  label: string;
  moods: string[];
  sign: '+' | '-';
  variant: 'high' | 'low';
};

function MoodGroup({ label, moods, sign, variant }: MoodGroupProps) {
  return (
    <section className="flex flex-col gap-3">
      <h4 className="text-foreground/80 text-xs uppercase">{label}</h4>

      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <MoodPill
            key={mood}
            mood={formatMoodLabel(mood)}
            sign={sign}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}

type MoodPillProps = {
  mood: string;
  sign: '+' | '-';
  variant: 'high' | 'low';
};

function MoodPill({ mood, sign, variant }: MoodPillProps) {
  const isHigh = variant === 'high';

  return (
    <span
      className={
        isHigh
          ? 'inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-foreground text-xs leading-none shadow-sm'
          : 'inline-flex max-w-full items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/5 px-3 py-1.5 text-muted-foreground text-xs leading-none'
      }
    >
      <span
        aria-hidden="true"
        className={
          isHigh ? 'text-base text-primary' : 'text-base text-destructive'
        }
      >
        {sign}
      </span>
      <span className="min-w-0 break-words leading-tight">{mood}</span>
    </span>
  );
}

function formatMoodLabel(mood: string) {
  const trimmedMood = mood.trim();

  if (!trimmedMood) {
    return trimmedMood;
  }

  return `${trimmedMood.charAt(0).toUpperCase()}${trimmedMood.slice(1)}`;
}
