import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { TonightMovieDetails } from '../_components/TonightMovieDetails';

const pickSlugs = ['safe', 'risk', 'wildcard'] as const;

type PickSlug = (typeof pickSlugs)[number];

type TonightMoviePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
    pick: string;
  }>;
};

export async function generateMetadata({
  params,
}: TonightMoviePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TonightPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TonightMoviePage({
  params,
}: TonightMoviePageProps) {
  const { slug, pick } = await params;
  const normalizedPick = pick.toLowerCase();

  if (!isPickSlug(normalizedPick)) {
    notFound();
  }

  return <TonightMovieDetails pick={normalizedPick} slug={slug} />;
}

function isPickSlug(value: string): value is PickSlug {
  return pickSlugs.includes(value as PickSlug);
}
