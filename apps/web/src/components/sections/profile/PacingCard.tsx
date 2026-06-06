'use client';

import { SpeedometerLowBold } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import type { TasteProfilePacingDto } from '@/api/generated/models';
import { cn } from '@/lib/utils';

type PacingCardProps = {
  pacing: TasteProfilePacingDto;
  className?: string;
};

const BREAKPOINTS = [
  { key: 'slow', min: 0, max: 33 },
  { key: 'medium', min: 34, max: 66 },
  { key: 'high', min: 67, max: 100 },
] as const;

type BreakpointKey = (typeof BREAKPOINTS)[number]['key'];

export default function PacingCard({ pacing, className }: PacingCardProps) {
  const t = useTranslations('ProfilePage.Sections.Timing');
  const score = clampScore(pacing.score);
  const activeBreakpoint = getActiveBreakpoint(score);

  return (
    <section
      className={cn(
        'flex flex-col rounded-md border border-sidebar-ring/8 bg-accent p-4 text-foreground',
        className,
      )}
    >
      <div className="mb-5 flex flex-row items-center gap-2">
        <SpeedometerLowBold className="size-6 shrink-0 text-primary" />
        <h3 className="font-medium text-xl">{t('title')}</h3>
      </div>

      <div className="px-1">
        <meter
          className="sr-only"
          high={67}
          low={33}
          max={100}
          min={0}
          optimum={50}
          value={score}
        >
          {score}
        </meter>

        <div aria-hidden="true" className="relative h-6">
          <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-background/80 shadow-inner" />

          <div
            aria-hidden="true"
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent bg-primary shadow-[0_0_12px_rgba(254,234,213,0.5)]"
            style={{ left: `${score}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 font-medium text-xs sm:text-sm">
          {BREAKPOINTS.map((breakpoint) => (
            <span
              className={cn(
                'min-w-0 truncate whitespace-nowrap text-foreground/50 transition-colors',
                breakpoint.key === 'medium' && 'text-center',
                breakpoint.key === 'high' && 'text-right',
                activeBreakpoint === breakpoint.key &&
                  'font-medium text-primary',
              )}
              key={breakpoint.key}
            >
              {t(`breakpoints.${breakpoint.key}`)}
            </span>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-lg text-center text-foreground/70 text-sm leading-relaxed">
        {pacing.description}
      </p>
    </section>
  );
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, score));
}

function getActiveBreakpoint(score: number): BreakpointKey {
  return (
    BREAKPOINTS.find(
      (breakpoint) => score >= breakpoint.min && score <= breakpoint.max,
    )?.key ?? 'medium'
  );
}
