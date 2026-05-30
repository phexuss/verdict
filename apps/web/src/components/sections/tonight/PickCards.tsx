import {
  BlackHoleLinear,
  CheckReadLinear,
  CourseUpLinear,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';

const picks = [
  {
    key: 'safe',
    icon: CheckReadLinear,
  },
  {
    key: 'risk',
    icon: CourseUpLinear,
  },
  {
    key: 'wildcard',
    icon: BlackHoleLinear,
  },
] as const;

export default function PickCards() {
  const t = useTranslations('TonightPage.genreMenu');

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <h2 className="text-sm uppercase font-medium text-secondary-foreground">
        {t('fourthLabel')}
      </h2>

      <div className="flex flex-col gap-2">
        {picks.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-row items-center gap-4 bg-accent rounded-md w-full p-4 border border-border min-h-30.5"
          >
            <div className="flex items-center justify-center shrink-0 size-12 bg-muted rounded-full">
              <Icon className="size-6 text-foreground" />
            </div>

            <div className="flex flex-col flex-1 gap-0.5">
              <div className="w-full text-lg font-semibold text-foreground">
                {t(`picks.${key}.label`)}
              </div>

              <p className="text-sm text-muted-foreground leading-snug">
                {t(`picks.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
