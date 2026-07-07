import { AlertCircle, Loader2 } from 'lucide-react';
import { MIN_QUERY_LENGTH } from './constants';

interface SearchEmptyStateProps {
  query: string;
  debouncedQuery: string;
  isLoading: boolean;
  isQueryValid: boolean;
  error: Error | null;
  hasResults: boolean;
  t: (key: string, params?: Record<string, string>) => string;
}

export function SearchEmptyState({
  query,
  debouncedQuery,
  isLoading,
  isQueryValid,
  error,
  hasResults,
  t,
}: SearchEmptyStateProps) {
  const trimmed = query.trim();

  if (!trimmed) {
    return (
      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
        {t('search.hint')}
      </div>
    );
  }

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return (
      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
        {t('search.minChars')}
      </div>
    );
  }

  if (isLoading && isQueryValid) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
        {t('search.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-6 text-sm text-red-400">
        <AlertCircle className="h-4 w-4" />
        {t('search.error')}
      </div>
    );
  }

  if (isQueryValid && !isLoading && !hasResults) {
    return (
      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
        {t('search.noResults', { query: debouncedQuery })}
      </div>
    );
  }

  return null;
}
