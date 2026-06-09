'use client';

import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { SettingsLinear } from '@solar-icons/react-perf';
import { Check, FileText, Globe, LogOut, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import SettingsMobileButton from './SettingsMobileButton';

export default function SettingsButton() {
  const t = useTranslations('Header.settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale || isPending) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <>
      <div className="md:hidden">
        <SettingsMobileButton />
      </div>
      <div className="hidden md:block">
        <DesktopSettings />
      </div>
    </>
  );

  function DesktopSettings() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="transition-colors hover:bg-accent data-[state=open]:bg-accent"
          >
            <SettingsLinear className="size-4 text-foreground md:size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 border-border bg-background shadow-md"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer gap-3 focus:bg-accent data-[state=open]:bg-accent">
                <Globe className="size-4 text-muted-foreground" />
                <span>{t('language')}</span>

                <span className="ml-auto flex items-center justify-center rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-primary uppercase shadow-sm">
                  {locale}
                </span>
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  sideOffset={6}
                  alignOffset={-4}
                  className="min-w-35 border-border bg-background shadow-md"
                >
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 focus:bg-accent"
                    onClick={() => switchLanguage('ru')}
                    disabled={isPending}
                  >
                    <span className="flex w-4 justify-center">
                      {locale === 'ru' && <Check className="size-3.5" />}
                    </span>
                    {t('locale.ru')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 focus:bg-accent"
                    onClick={() => switchLanguage('en')}
                    disabled={isPending}
                  >
                    <span className="flex w-4 justify-center">
                      {locale === 'en' && <Check className="size-3.5" />}
                    </span>
                    {t('locale.en')}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer gap-3 focus:bg-accent">
              <FileText className="size-4 text-muted-foreground" />
              <span>{t('tou')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-3 focus:bg-accent">
              <Shield className="size-4 text-muted-foreground" />
              <span>{t('privacy')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="size-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
