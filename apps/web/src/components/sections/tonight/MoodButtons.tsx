'use client';

import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import { useTranslations } from 'next-intl';

const genreKeys = [
  'dark',
  'tense',
  'weird',
  'atmospheric',
  'comfort',
  'smart',
  'fast',
  'emotional',
  'funny',
] as const;

export type MoodKey = (typeof genreKeys)[number];

type MoodButtonsProps = {
  selected: MoodKey[];
  onSelectedChange: (selected: MoodKey[]) => void;
};

export default function MoodButtons({
  selected,
  onSelectedChange,
}: MoodButtonsProps) {
  const t = useTranslations('TonightPage');

  function handleChange(next: string[]) {
    if (next.length > 3) return;
    onSelectedChange(next as MoodKey[]);
  }

  return (
    <div className="mb-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Mood · {selected.length}/3
      </p>
      <ToggleGroup
        type="multiple"
        value={selected}
        onValueChange={handleChange}
        className="flex flex-wrap justify-start gap-2"
      >
        {genreKeys.map((genre) => (
          <ToggleGroupItem
            key={genre}
            value={genre}
            disabled={!selected.includes(genre) && selected.length >= 3}
            className="h-9 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm shadow-[inset_0_1px_0_oklch(1_0_0/0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-foreground hover:shadow-[0_0_18px_-6px_oklch(0.76_0.13_65/0.5)] active:scale-95 data-[state=on]:border-primary/60 data-[state=on]:bg-primary data-[state=on]:bg-[linear-gradient(180deg,oklch(0.83_0.12_72),var(--primary))] data-[state=on]:text-primary-foreground data-[state=on]:shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_0_22px_-4px_oklch(0.76_0.13_65/0.75)]"
          >
            {t(`genres.${genre}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
