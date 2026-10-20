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
              className="group/group-button relative flex h-18 min-w-0 flex-col gap-2 overflow-hidden rounded-2xl border-white/8 bg-white/[0.02] px-2 py-4 text-muted-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.04)] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] hover:text-foreground active:scale-[0.97] data-[state=on]:border-primary/60 data-[state=on]:bg-primary/10 data-[state=on]:bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.76_0.13_65/0.22),transparent_70%)] data-[state=on]:text-foreground data-[state=on]:shadow-[inset_0_1px_0_oklch(1_0_0/0.08),0_0_28px_-10px_oklch(0.76_0.13_65/0.7)] sm:h-24 lg:h-28"
            >
              <Icon
                size={36}
                className="text-current transition-[color,transform,filter] duration-300 group-hover/group-button:-translate-y-0.5 group-data-[state=on]/group-button:text-primary group-data-[state=on]/group-button:drop-shadow-[0_0_10px_oklch(0.76_0.13_65/0.7)]"
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
