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
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
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
            className="h-9 rounded-full border px-4 text-sm transition-all duration-200 hover:border-primary/50 hover:text-foreground data-[state=on]:border-primary/60 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-[0_0_14px_-3px_oklch(0.76_0.13_65/0.6)]"
          >
            {t(`genres.${genre}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
