import { Button } from '@repo/ui/components/button';
import { VideoFrameLinear } from '@solar-icons/react-perf';
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
    <Button
      className="w-full rounded-lg"
      disabled={isDisabled}
      onClick={onClick}
      size="lg"
      type="button"
    >
      <VideoFrameLinear className="size-4" />
      {isPending ? t('findButtonLoading') : t('findButton')}
    </Button>
  );
}
