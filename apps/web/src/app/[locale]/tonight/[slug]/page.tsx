import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RecommendationDetails } from './_components/RecommendationDetails';

type TonightMoviesPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: TonightMoviesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TonightPage' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: `${t('title')} — Verdict`, description: t('description') },
  };
}

export default async function TonightMoviesPage({
  params,
}: TonightMoviesPageProps) {
  const { slug } = await params;

  return <RecommendationDetails slug={slug} />;
}
