'use client';

import { Button } from '@repo/ui/components/button';
import { VideoFrameLinear } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type FindPicksButtonProps = {
  disabled?: boolean;
  isPending?: boolean;
  onClick: () => void;
};

export default function FindPicksButton({
  disabled,
  isPending,
  onClick,
}: FindPicksButtonProps) {
  const t = useTranslations('TonightPage.genreMenu');
  const [isHydrated, setIsHydrated] = useState(false);
  const isDisabled = isHydrated && Boolean(disabled || isPending);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.015 } : undefined}
      whileTap={!isDisabled ? { scale: 0.975 } : undefined}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Button
        className={[
          'relative w-full rounded-xl transition-shadow duration-500',
          !isDisabled ? 'shadow-[0_0_24px_-4px_oklch(0.76_0.13_65/0.45)]' : '',
        ].join(' ')}
        disabled={isDisabled}
        onClick={onClick}
        size="lg"
        type="button"
      >
        {isPending ? (
          <>
            <span className="relative flex size-4 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-60" />
              <VideoFrameLinear className="relative size-4" />
            </span>
          </>
        ) : (
          <VideoFrameLinear className="size-4" />
        )}
        {isPending ? t('findButtonLoading') : t('findButton')}
      </Button>
    </motion.div>
  );
}
