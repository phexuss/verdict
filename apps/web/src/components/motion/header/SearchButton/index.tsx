'use client';

import { useLocale, useTranslations } from 'next-intl';
import { SearchPalette } from './SearchPalette';
import { SearchTrigger } from './SearchTrigger';
import { useSearchPalette } from './useSearchPalette';

export function SearchButton() {
  const t = useTranslations('Header.navigation');
  const locale = useLocale();

  const {
    isOpen,
    open,
    close,
    query,
    setQuery,
    results,
    isLoading,
    error,
    debouncedQuery,
    isQueryValid,
  } = useSearchPalette(locale);

  return (
    <>
      <SearchTrigger onClick={open} t={t} />

      <SearchPalette
        isOpen={isOpen}
        query={query}
        setQuery={setQuery}
        results={results}
        isLoading={isLoading}
        error={error}
        debouncedQuery={debouncedQuery}
        isQueryValid={isQueryValid}
        close={close}
        locale={locale}
        t={t}
      />
    </>
  );
}
