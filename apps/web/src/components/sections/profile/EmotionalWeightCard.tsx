'use client';

import { ScaleBold } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import type { TasteProfileEmotionalWeightDto } from '@/api/generated/models';
import { cn } from '@/lib/utils';

type EmotionalWeightCardProps = {
  emotionalWeight: TasteProfileEmotionalWeightDto;
  className?: string;
};

export default function EmotionalWeightCard({
  emotionalWeight,
  className,
}: EmotionalWeightCardProps) {
  const t = useTranslations('ProfilePage.Sections.Emotional');
  const primaryScore = clampScore(emotionalWeight.score);
  const secondaryScore = 100 - primaryScore;

  return (
    <section
      className={cn(
        'flex flex-col rounded-2xl surface p-4 text-foreground',
        className,
      )}
    >
      <div className="mb-5 flex flex-row items-center gap-2">
        <ScaleBold className="size-6 shrink-0 text-primary drop-shadow-[0_0_8px_oklch(0.76_0.13_65/0.55)]" />
        <h3 className="font-medium text-xl">{t('title')}</h3>
      </div>

      <div className="flex flex-col gap-7">
        <EmotionalBar
          label={emotionalWeight.label || t('moods.1')}
          score={primaryScore}
          variant="primary"
        />
        <EmotionalBar
          label={t('moods.2')}
          score={secondaryScore}
          variant="secondary"
        />
      </div>
    </section>
  );
}

type EmotionalBarProps = {
  label: string;
  score: number;
  variant: 'primary' | 'secondary';
};

function EmotionalBar({ label, score, variant }: EmotionalBarProps) {
  const isPrimary = variant === 'primary';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p
          className={cn(
            'min-w-0 truncate font-medium text-base',
            isPrimary ? 'text-foreground' : 'text-foreground/70',
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            'shrink-0 font-medium text-base',
            isPrimary ? 'text-primary' : 'text-foreground/70',
          )}
        >
          {score}%
        </p>
      </div>

      <meter className="sr-only" max={100} min={0} value={score}>
        {score}
      </meter>
      <div
        aria-hidden="true"
        className="h-2 overflow-hidden rounded-full bg-background/80 shadow-inner"
      >
        <div
          className={cn(
            'h-full rounded-full',
            isPrimary ? 'bg-primary' : 'bg-foreground/15',
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}
