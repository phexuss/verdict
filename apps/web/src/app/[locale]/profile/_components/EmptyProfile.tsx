'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/sonner';
import {
  ClapperboardOutline,
  ClockCircleLinear,
  LockKeyholeMinimalisticLinear,
  RefreshLinear,
  SkipNextLinear,
} from '@solar-icons/react-perf';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  getGetTasteProfileQueryKey,
  useRefreshTasteProfile,
} from '@/api/generated/user/user';
import { Link } from '@/i18n/navigation';

const MIN_MOVIES = 5;

const ease = [0.22, 1, 0.36, 1] as const;

const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function GhostCard({
  icon,
  title,
  hint,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-36 flex-col rounded-xl border border-foreground/8 bg-accent p-4 ${className}`}
    >
      <div className="mb-3 flex flex-row items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="font-medium text-xl">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-2 text-center">
        <LockKeyholeMinimalisticLinear className="size-5 text-foreground/20" />
        <p className="max-w-[22ch] text-foreground/40 text-sm leading-relaxed">
          {hint}
        </p>
      </div>
    </div>
  );
}

interface EmptyProfileProps {
  markedCount: number;
}

export default function EmptyProfile({ markedCount }: EmptyProfileProps) {
  const t = useTranslations('ProfilePage');
  const s = useTranslations('ProfilePage.Sections');
  const e = useTranslations('ProfilePage.emptyState');
  const locale = useLocale();
  const queryClient = useQueryClient();

  const isReady = markedCount >= MIN_MOVIES;
  const remaining = Math.max(0, MIN_MOVIES - markedCount);
  const progressPct = Math.min(100, (markedCount / MIN_MOVIES) * 100);

  const refreshTasteProfile = useRefreshTasteProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTasteProfileQueryKey(),
        });
      },
      onError: () => {
        toast.error(e('generateLoading'));
      },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease }}
      className="mx-auto flex w-full max-w-7xl flex-col gap-10"
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between md:gap-8"
      >
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="font-medium text-primary text-xs uppercase tracking-widest">
            {t('title')}
          </h1>
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="wrap-break-word text-3xl font-semibold leading-tight tracking-tight md:text-5xl xl:text-6xl">
              {e('headline')}
            </h2>
            <span className="wrap-break-word text-2xl font-semibold leading-tight tracking-tight text-foreground/30 md:text-4xl xl:text-5xl">
              {e('tagline')}
            </span>
          </div>

          <div className="mt-1 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.7, ease }}
                />
              </div>
              <span className="whitespace-nowrap text-sm font-medium tabular-nums text-foreground/60">
                {e('progressLabel', { count: markedCount })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground/70">
              {isReady ? e('readyHint') : e('progressHint', { remaining })}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:pb-2">
          {isReady ? (
            <Button
              className="border-primary/25 bg-primary/10 text-foreground hover:border-primary/40 hover:bg-primary/15"
              disabled={refreshTasteProfile.isPending}
              onClick={() =>
                refreshTasteProfile.mutate({
                  params: { locale: locale === 'ru' ? 'ru' : 'en' },
                })
              }
              variant="outline"
            >
              <RefreshLinear
                className={
                  refreshTasteProfile.isPending ? 'size-4 animate-spin' : 'size-4'
                }
              />
              {refreshTasteProfile.isPending
                ? e('generateLoading')
                : e('generateButton')}
            </Button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/curated"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:border-primary/40 hover:bg-accent"
              >
                {e('ctaCurated')}
              </Link>
              <Link
                href="/tonight"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground transition-opacity hover:opacity-90"
              >
                {e('ctaTonight')}
              </Link>
            </div>
          )}
        </div>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.95fr)] lg:items-start">
        <motion.div
          variants={colVariants}
          initial="hidden"
          animate="show"
          className="flex min-w-0 flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <GhostCard
              icon={<span className="text-xl">🎭</span>}
              title={s('Atmosphere.title')}
              hint={e('Sections.mood')}
              className="min-h-52"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-4 sm:grid-cols-2"
          >
            <GhostCard
              icon={<span className="text-xl">🎬</span>}
              title="—"
              hint={e('Sections.identity')}
            />
            <GhostCard
              icon={<span className="text-xl">⭐</span>}
              title="—"
              hint={e('Sections.identity')}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col rounded-xl border border-foreground/8 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="mb-3 flex flex-row items-center gap-2 sm:mb-0">
              <ClapperboardOutline className="size-6 shrink-0 text-primary" />
              <h3 className="font-medium text-xl">
                {s('FrequentlySeen.title')}
              </h3>
            </div>
            <p className="text-foreground/40 text-sm leading-relaxed sm:text-right">
              {e('Sections.frequentlySeen')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GhostCard
              icon={<span className="text-xl">🎞️</span>}
              title={s('MovieShelf.title')}
              hint={e('Sections.shelf')}
              className="min-h-44"
            />
          </motion.div>
        </motion.div>

        <motion.aside
          variants={colVariants}
          initial="hidden"
          animate="show"
          className="flex min-w-0 flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <GhostCard
              icon={<span className="text-xl">⏱️</span>}
              title={s('Timing.title')}
              hint={e('Sections.pacing')}
              className="min-h-44"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <GhostCard
              icon={<span className="text-xl">🌊</span>}
              title={s('Emotional.title')}
              hint={e('Sections.emotional')}
              className="min-h-44"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="flex min-h-36 flex-col rounded-xl border border-foreground/8 bg-accent p-4">
              <div className="mb-3 flex flex-row items-center gap-2">
                <ClockCircleLinear className="size-6 shrink-0 text-primary" />
                <h3 className="font-medium text-xl">{s('Runtime.time')}</h3>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                <LockKeyholeMinimalisticLinear className="size-5 text-foreground/20" />
                <p className="text-foreground/40 text-xs">
                  {e('Sections.runtime')}
                </p>
              </div>
            </div>

            <div className="flex min-h-36 flex-col rounded-xl border border-foreground/8 bg-accent p-4">
              <div className="mb-3 flex flex-row items-center gap-2">
                <SkipNextLinear className="size-6 shrink-0 text-primary" />
                <h3 className="font-medium text-xl">{s('Runtime.skip')}</h3>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                <LockKeyholeMinimalisticLinear className="size-5 text-foreground/20" />
                <p className="text-foreground/40 text-xs">
                  {e('Sections.runtime')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GhostCard
              icon={<span className="text-xl">🌙</span>}
              title={s('TonightHistory.title')}
              hint={e('Sections.tonight')}
              className="min-h-44"
            />
          </motion.div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
