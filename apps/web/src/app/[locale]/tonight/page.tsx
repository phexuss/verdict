import { useTranslations } from 'next-intl';
import { GenreMenu } from '@/components/sections/tonight/GenreMenu';

export default function TonightPage() {
  const t = useTranslations('TonightPage');
  return (
    <div className="flex px-4 items-center justify-center pt-6">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-medium">{t('title')}</h1>
        <p className="text-base text-muted-foreground mt-2">
          {t('description')}
        </p>
        <GenreMenu />
      </div>
    </div>
  );
}
