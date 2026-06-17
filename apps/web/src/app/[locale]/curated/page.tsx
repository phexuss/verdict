import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CuratedMovies } from './_components/CuratedMovies';

type CuratedPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CuratedPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CuratedPage' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: `${t('title')} — Verdict`, description: t('description') },
  };
}

export default function CuratedPage() {
  return <CuratedMovies />;
}
