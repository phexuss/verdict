import { getTranslations } from 'next-intl/server';
import NotFoundScene from '@/components/motion/not-found/NotFoundScene';

export default async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <NotFoundScene
      title={t('title')}
      description={t('description')}
      ctaLabel={t('cta')}
    />
  );
}
