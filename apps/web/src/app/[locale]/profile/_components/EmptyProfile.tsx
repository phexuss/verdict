'use client';

import {
  ClapperboardOutline,
  ClockCircleLinear,
  LockKeyholeMinimalisticLinear,
  SkipNextLinear,
} from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

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

export default function EmptyProfile() {
  const t = useTranslations('ProfilePage');
  const s = useTranslations('ProfilePage.Sections');
  const e = useTranslations('ProfilePage.emptyState');

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
            <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl xl:text-6xl">
              {e('headline')}
            </h2>
            <span className="text-3xl font-semibold leading-tight tracking-tight text-foreground/30 md:text-4xl xl:text-5xl">
              {e('tagline')}
            </span>
          </div>
          <p className="max-w-md text-muted-foreground/70 text-sm leading-relaxed">
            {e('hint')}
          </p>
        </div>

        <div className="flex shrink-0 flex-row gap-2 md:pb-2">
          <Link
            href="/curated"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
          >
            {e('ctaCurated')}
          </Link>
          <Link
            href="/tonight"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {e('ctaTonight')}
          </Link>
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
