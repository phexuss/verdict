import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import {
  UserLinear,
  UsersGroupRoundedLinear,
  UsersGroupTwoRoundedLinear,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';

const groupKeys = [
  { value: 'solo', icon: UserLinear },
  { value: 'duo', icon: UsersGroupRoundedLinear },
  { value: 'group', icon: UsersGroupTwoRoundedLinear },
] as const;

export type GroupKey = (typeof groupKeys)[number]['value'];

type GroupButtonsProps = {
  value: GroupKey;
  onValueChange: (value: GroupKey) => void;
};

export default function GroupButtons({
  value,
  onValueChange,
}: GroupButtonsProps) {
  const t = useTranslations('TonightPage.genreMenu');

  return (
    <div className="space-y-4 py-5">
      <h2 className="font-semibold text-lg leading-tight">
        {t('secondLabel')}
      </h2>
      <ToggleGroup
        variant="outline"
        type="single"
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onValueChange(nextValue as GroupKey);
          }
        }}
        className="grid w-full grid-cols-3 gap-3"
      >
        {groupKeys.map(({ value, icon: Icon }) => {
          const label = t(`groups.${value}`);

          return (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={label}
              className="group/group-button flex h-18 min-w-0 flex-col gap-2 rounded-2xl border-border/80 bg-background/20 px-2 py-4 text-muted-foreground transition-all hover:border-border hover:bg-muted/40 hover:text-foreground data-[state=on]:border-primary/70 data-[state=on]:bg-primary/10 data-[state=on]:text-foreground sm:h-24 lg:h-28"
            >
              <Icon
                size={36}
                className="text-current transition-colors group-data-[state=on]/group-button:text-primary"
              />
              <span className="truncate font-semibold text-base leading-none sm:text-lg">
                {label}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
