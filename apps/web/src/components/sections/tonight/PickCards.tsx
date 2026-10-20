'use client';

import {
  BlackHoleLinear,
  CheckReadLinear,
  CourseUpLinear,
} from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

const picks = [
  { key: 'safe', icon: CheckReadLinear },
  { key: 'risk', icon: CourseUpLinear },
  { key: 'wildcard', icon: BlackHoleLinear },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease },
  },
};

export default function PickCards() {
  const t = useTranslations('TonightPage.genreMenu');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
        {t('fourthLabel')}
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid w-full gap-3 md:grid-cols-3 lg:grid-cols-1"
      >
        {picks.map(({ key, icon: Icon }) => (
          <motion.div
            key={key}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="surface surface-interactive group/pick flex min-h-30.5 w-full flex-row items-center gap-4 rounded-2xl p-4 md:flex-col md:items-start lg:flex-row lg:items-center"
          >
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-[radial-gradient(circle_at_30%_25%,oklch(0.76_0.13_65/0.28),oklch(0.76_0.13_65/0.06)_70%)] shadow-[inset_0_1px_0_oklch(1_0_0/0.1),0_0_20px_-6px_oklch(0.76_0.13_65/0.55)] transition-shadow duration-300 group-hover/pick:shadow-[inset_0_1px_0_oklch(1_0_0/0.12),0_0_28px_-4px_oklch(0.76_0.13_65/0.75)]">
              <Icon className="size-6 text-primary drop-shadow-[0_0_6px_oklch(0.76_0.13_65/0.6)]" />
            </div>

            <div className="flex flex-1 flex-col gap-0.5">
              <div className="w-full font-semibold text-base text-foreground">
                {t(`picks.${key}.label`)}
              </div>
              <p className="text-muted-foreground/75 text-sm leading-snug">
                {t(`picks.${key}.description`)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
