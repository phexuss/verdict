'use client';

import { Button } from '@repo/ui/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer';
import { SettingsLinear } from '@solar-icons/react-perf';
import { FileText, Shield, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default function SettingsMobileButton() {
  const t = useTranslations('Header.settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale || isPending) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale, scroll: false });
    });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="transition-colors hover:bg-accent"
        >
          <SettingsLinear className="size-5 text-foreground" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-border bg-background px-4">
        <DrawerHeader className="flex items-center justify-between px-0 pb-2 pt-6">
          <DrawerTitle className="text-2xl font-semibold text-foreground">
            {t('title')}
          </DrawerTitle>

          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col gap-6 pb-8 pt-4">
          <div className="space-y-3">
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {t('language')}
            </p>

            <div className="flex rounded-xl bg-accent p-1">
              <Button
                variant="ghost"
                onClick={() => switchLanguage('ru')}
                disabled={isPending}
                className={cn(
                  'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                  locale === 'ru'
                    ? 'border border-border bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                  isPending && 'opacity-80',
                )}
              >
                {t('locale.ru')}
              </Button>

              <Button
                variant="ghost"
                onClick={() => switchLanguage('en')}
                disabled={isPending}
                className={cn(
                  'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                  locale === 'en'
                    ? 'border border-border bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                  isPending && 'opacity-80',
                )}
              >
                {t('locale.en')}
              </Button>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {t('legalInfo')}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 rounded-xl bg-accent p-3.5 text-left transition-colors hover:bg-muted active:bg-muted"
              >
                <FileText className="size-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {t('tou')}
                </span>
              </Button>

              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 rounded-xl bg-accent p-3.5 text-left transition-colors hover:bg-muted active:bg-muted"
              >
                <Shield className="size-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {t('privacy')}
                </span>
              </Button>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col items-center justify-center space-y-1 pb-6 pt-4">
            <h1 className="text-4xl font-bold tracking-widest text-white/[0.04]">
              VERDICT
            </h1>
            <p className="text-xs text-muted-foreground/50">{t('version')}</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
