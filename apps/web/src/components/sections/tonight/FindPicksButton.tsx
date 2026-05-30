import { Button } from '@repo/ui/components/button';
import { VideoFrameLinear } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';

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

  return (
    <Button
      className="w-full"
      disabled={disabled || isPending}
      onClick={onClick}
      size="lg"
      type="button"
    >
      <VideoFrameLinear className="size-4" />
      {isPending ? t('findButtonLoading') : t('findButton')}
    </Button>
  );
}
