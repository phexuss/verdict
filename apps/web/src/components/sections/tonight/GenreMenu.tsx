import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';

import { useTranslations } from 'next-intl';
import GroupButtons from './GroupButtons';
import MoodButtons from './MoodButtons';
import PickCards from './PickCards';
import TimeSlider from './TimeSlider';

export function GenreMenu() {
  const t = useTranslations('TonightPage.genreMenu');
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('label')}</CardTitle>
        <CardDescription className="uppercase text-xs">
          {t('selectLabel')}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <MoodButtons />
        <Separator orientation="horizontal" />
        <GroupButtons />
        <Separator orientation="horizontal" />
        <TimeSlider />
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <PickCards />
      </CardFooter>
    </Card>
  );
}
