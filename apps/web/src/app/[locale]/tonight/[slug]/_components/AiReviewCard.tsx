import { StarBold } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

type AiReviewCardProps = {
  pickReason: string | null;
  trioReason: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function AiReviewCard({ pickReason, trioReason }: AiReviewCardProps) {
  const t = useTranslations('TonightPage.pickDetails');

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease }}
      className="flex flex-col gap-5 rounded-xl border border-primary/25 bg-primary/10 p-5 shadow-[0_0_0_1px_oklch(0.76_0.13_65/0.04)]"
    >
      <div className="flex items-center gap-2 text-primary">
        <StarBold className="size-5 shrink-0" />
        <h2 className="font-medium text-xl">{t('aiReview')}</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
          {t('whyThisPick')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {pickReason ?? '-'}
        </p>
      </div>

      {trioReason ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
            {t('trioContext')}
          </p>
          <p className="text-foreground/70 text-sm leading-relaxed">
            {trioReason}
          </p>
        </div>
      ) : null}
    </motion.section>
  );
}
