'use client';

import { useTranslations } from 'next-intl';
import ErrorScene from '@/components/motion/error/ErrorScene';

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations('ErrorPage');

  return (
    <ErrorScene
      title={t('title')}
      description={t('description')}
      retryLabel={t('retry')}
      homeLabel={t('home')}
      onRetry={reset}
    />
  );
}
