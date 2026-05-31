import { useTranslations } from 'next-intl';
import { GenreMenu } from '@/components/sections/tonight/GenreMenu';

export default function TonightPage() {
  const t = useTranslations('TonightPage');
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 pt-6 sm:px-6 md:gap-8 md:pt-10 lg:px-8">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="text-2xl font-medium leading-tight sm:text-3xl md:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground md:text-lg">
          {t('description')}
        </p>
      </div>

      <GenreMenu />
    </main>
  );
}
