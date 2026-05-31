'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCreateRecommendation } from '@/api/generated/recommendations/recommendations';
import { useRouter } from '@/i18n/navigation';
import FindPicksButton from './FindPicksButton';
import GroupButtons, { type GroupKey } from './GroupButtons';
import MoodButtons, { type MoodKey } from './MoodButtons';
import PickCards from './PickCards';
import TimeSlider, { DEFAULT_MAX_RUNTIME_MINUTES } from './TimeSlider';

export function GenreMenu() {
  const t = useTranslations('TonightPage.genreMenu');
  const locale = useLocale();
  const router = useRouter();
  const [moods, setMoods] = useState<MoodKey[]>([]);
  const [group, setGroup] = useState<GroupKey>('solo');
  const [maxRuntimeMinutes, setMaxRuntimeMinutes] = useState(
    DEFAULT_MAX_RUNTIME_MINUTES,
  );
  const createRecommendation = useCreateRecommendation({
    mutation: {
      onSuccess: (response) => {
        router.push(`/tonight/${response.data.slug}`);
      },
    },
  });

  function handleFindPicks() {
    createRecommendation.mutate({
      data: {
        moods,
        group,
        duration: getDuration(maxRuntimeMinutes),
        maxRuntimeMinutes,
        locale: locale === 'ru' ? 'ru' : 'en',
      },
    });
  }

  return (
    <Card className="w-full max-w-md md:max-w-3xl lg:max-w-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('label')}</CardTitle>
        <CardDescription className="uppercase text-xs">
          {t('selectLabel')}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
        <div>
          <MoodButtons selected={moods} onSelectedChange={setMoods} />
          <Separator orientation="horizontal" />
          <GroupButtons value={group} onValueChange={setGroup} />
          <Separator orientation="horizontal" />
          <TimeSlider
            minutes={maxRuntimeMinutes}
            onMinutesChange={setMaxRuntimeMinutes}
          />
        </div>

        <div className="flex flex-col gap-4">
          <PickCards />
          <FindPicksButton
            disabled={moods.length === 0}
            isPending={createRecommendation.isPending}
            onClick={handleFindPicks}
          />
          {createRecommendation.error ? (
            <p className="text-destructive text-sm">{t('findError')}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function getDuration(minutes: number) {
  if (minutes <= 100) {
    return 'short';
  }

  if (minutes <= 160) {
    return 'medium';
  }

  return 'long';
}
