'use client';

import { Slider } from '@repo/ui/components/slider';
import { useTranslations } from 'next-intl';

const MIN_HOURS = 1;
const MAX_HOURS = 4;
const MIN_MINUTES = MIN_HOURS * 60;
const MAX_MINUTES = MAX_HOURS * 60;
const STEP_MINUTES = 15;
export const DEFAULT_MAX_RUNTIME_MINUTES = 135;

const timeMarks = [1, 2, 3, MAX_HOURS] as const;

type TimeSliderProps = {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
};

export default function TimeSlider({
  minutes,
  onMinutesChange,
}: TimeSliderProps) {
  const t = useTranslations('TonightPage.genreMenu');

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return t('time.hoursShort', { hours });
    }

    return t('time.duration', { hours, minutes: remainingMinutes });
  }

  function handleValueChange(nextValue: number[]) {
    onMinutesChange(nextValue[0] ?? DEFAULT_MAX_RUNTIME_MINUTES);
  }

  function formatTimeMark(hours: number) {
    if (hours === MAX_HOURS) {
      return t('time.hoursPlusShort', { hours });
    }

    return t('time.hoursShort', { hours });
  }

  const selectedDuration = formatDuration(minutes);

  return (
    <section className="flex flex-col gap-3 py-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-medium text-lg leading-tight">{t('thirdLabel')}</h2>
        <p
          className="shrink-0 pt-1  text-primary text-sm leading-none"
          aria-live="polite"
        >
          {selectedDuration} {t('time.maxSuffix')}
        </p>
      </div>

      <Slider
        aria-label={t('thirdLabel')}
        aria-valuetext={selectedDuration}
        min={MIN_MINUTES}
        max={MAX_MINUTES}
        step={STEP_MINUTES}
        value={[minutes]}
        onValueChange={handleValueChange}
      />

      <div
        className="flex justify-between px-1 text-sm text-muted-foreground"
        aria-hidden="true"
      >
        {timeMarks.map((hours) => (
          <span key={hours}>{formatTimeMark(hours)}</span>
        ))}
      </div>
    </section>
  );
}
