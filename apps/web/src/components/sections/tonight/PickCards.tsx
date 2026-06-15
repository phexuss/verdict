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
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
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
            className="flex min-h-30.5 w-full flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 md:flex-col md:items-start lg:flex-row lg:items-center"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted/80">
              <Icon className="size-6 text-primary" />
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
