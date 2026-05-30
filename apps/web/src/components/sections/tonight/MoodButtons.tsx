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
    <div className="space-y-4 mb-4">
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
            className="
              rounded-full border px-4 text-sm
              data-[state=on]:bg-primary
              data-[state=on]:text-primary-foreground
            "
          >
            {t(`genres.${genre}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
