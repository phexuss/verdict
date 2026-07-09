import { Badge } from '@repo/ui/components/badge';
import { StarBold } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { AiReviewResponseDto } from '@/api/generated/models';

const ease = [0.22, 1, 0.36, 1] as const;

type AiMovieReviewCardProps = {
  review: AiReviewResponseDto;
};

export function AiMovieReviewCard({ review }: AiMovieReviewCardProps) {
  const t = useTranslations('AiReview');

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease }}
      className="flex flex-col gap-5 rounded-xl border border-primary/25 bg-primary/10 p-5 shadow-[0_0_0_1px_oklch(0.76_0.13_65/0.04)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <StarBold className="size-5 shrink-0" />
          <h2 className="font-medium text-xl">{t('title')}</h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1">
          <span className="font-semibold text-primary text-sm tabular-nums">
            {review.aiScore}
          </span>
          <span className="text-primary/60 text-xs">/100</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
          {t('summary')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {review.aiSummary}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
          {t('analysis')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {review.aiAnalysis}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
          {t('verdict')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {review.aiVerdict}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
          {t('reason')}
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {review.aiReason}
        </p>
      </div>

      {review.aiMoodTags.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70">
            {t('moodTags')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {review.aiMoodTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs text-primary capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
