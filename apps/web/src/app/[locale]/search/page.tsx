import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SearchResults } from './_components/SearchResults';

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  const title = q ? `"${q}" — ${t('title')}` : t('title');

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const { q, page } = await searchParams;

  return (
    <SearchResults
      query={q ?? ''}
      page={page ? Number.parseInt(page, 10) : 1}
      locale={locale}
    />
  );
}
