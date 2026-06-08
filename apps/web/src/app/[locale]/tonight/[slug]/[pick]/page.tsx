import { notFound } from 'next/navigation';
import { TonightMovieDetails } from '../_components/TonightMovieDetails';

const pickSlugs = ['safe', 'risk', 'wildcard'] as const;

type PickSlug = (typeof pickSlugs)[number];

type TonightMoviePageProps = {
  params: Promise<{
    slug: string;
    pick: string;
  }>;
};

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
