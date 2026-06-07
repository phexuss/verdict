'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/sonner';
import { RefreshLinear } from '@solar-icons/react-perf';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import {
  getGetTasteProfileQueryKey,
  useRefreshTasteProfile,
} from '@/api/generated/user/user';

export default function RefreshTasteProfileCard() {
  const t = useTranslations('ProfilePage.Sections.RefreshProfile');
  const locale = useLocale();
  const queryClient = useQueryClient();

  const refreshTasteProfile = useRefreshTasteProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTasteProfileQueryKey(),
        });
        toast.success(t('success'));
      },
      onError: () => {
        toast.error(t('error'));
      },
    },
  });

  return (
    <section className="flex flex-col gap-4 rounded-md border border-sidebar-ring/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-medium text-lg">{t('title')}</h3>
        <p className="mt-1 max-w-xl text-foreground/70 text-sm leading-relaxed">
          {t('description')}
        </p>
      </div>

      <Button
        className="w-full border-primary/25 bg-primary/10 text-foreground hover:border-primary/40 hover:bg-primary/15 sm:w-fit"
        disabled={refreshTasteProfile.isPending}
        onClick={() => {
          refreshTasteProfile.mutate({
            params: {
              locale: locale === 'ru' ? 'ru' : 'en',
            },
          });
        }}
        variant="outline"
      >
        <RefreshLinear
          className={
            refreshTasteProfile.isPending ? 'size-4 animate-spin' : 'size-4'
          }
        />
        {refreshTasteProfile.isPending ? t('loading') : t('button')}
      </Button>
    </section>
  );
}
