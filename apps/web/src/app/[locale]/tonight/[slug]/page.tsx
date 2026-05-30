import { RecommendationDetails } from './_components/RecommendationDetails';

type TonightMoviesPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function TonightMoviesPage({
  params,
}: TonightMoviesPageProps) {
  const { slug } = await params;

  return <RecommendationDetails slug={slug} />;
}
