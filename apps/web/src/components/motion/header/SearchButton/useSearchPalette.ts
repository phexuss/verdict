import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchMovies } from '@/api/generated/tmdb/tmdb';
import { detectQueryLocale } from '@/lib/tmdb-helper';
import { DEBOUNCE_MS, MIN_QUERY_LENGTH, STALE_TIME_MS } from './constants';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useSearchPalette(locale: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);
  const isQueryValid = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const maxResults = useMemo(() => {
    if (typeof window === 'undefined') return 6;
    const h = window.innerHeight;
    if (h < 600) return 3;
    if (h < 800) return 5;
    return 6;
  }, []);

  const { data, isLoading, error } = useSearchMovies(
    {
      query: debouncedQuery,
      locale: detectQueryLocale(debouncedQuery, locale),
      page: 1,
    },
    {
      query: {
        enabled: isQueryValid && isOpen,
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
      },
    },
  );

  const results = data?.data?.results?.slice(0, maxResults) ?? [];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
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
  };
}
