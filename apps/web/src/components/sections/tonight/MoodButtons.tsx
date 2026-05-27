'use client';

import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

type GenreKey = (typeof genreKeys)[number];

export default function ToggleButtons() {
  const t = useTranslations('TonightPage');
  const [selected, setSelected] = useState<GenreKey[]>([]);

  function handleChange(next: string[]) {
    if (next.length > 3) return;
    setSelected(next as GenreKey[]);
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
