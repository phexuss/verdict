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
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-sm uppercase font-medium text-secondary-foreground">
        {t('fourthLabel')}
      </h2>

      <div className="grid w-full gap-2 md:grid-cols-3 lg:grid-cols-1">
        {picks.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex min-h-30.5 w-full flex-row items-center gap-4 rounded-md border border-border bg-accent p-4 md:flex-col md:items-start lg:flex-row lg:items-center"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-6 text-foreground" />
            </div>

            <div className="flex flex-1 flex-col gap-0.5">
              <div className="w-full font-semibold text-foreground text-lg">
                {t(`picks.${key}.label`)}
              </div>

              <p className="text-muted-foreground text-sm leading-snug">
                {t(`picks.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
