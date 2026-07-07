import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TmdbMovie } from '@/api/generated/models';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchResultItem } from './SearchResultItem';

interface SearchPaletteProps {
  isOpen: boolean;
  query: string;
  setQuery: (query: string) => void;
  results: TmdbMovie[];
  isLoading: boolean;
  error: Error | null;
  debouncedQuery: string;
  isQueryValid: boolean;
  close: () => void;
  locale: string;
  t: (key: string, params?: Record<string, string>) => string;
}

export function SearchPalette({
  isOpen,
  query,
  setQuery,
  results,
  isLoading,
  error,
  debouncedQuery,
  isQueryValid,
  close,
  locale,
  t,
}: SearchPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const navigateToMovie = useCallback(
    (_movie: TmdbMovie) => {
      close();
    },
    [close],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!results.length) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next =
            selectedIndex < results.length - 1 ? selectedIndex + 1 : 0;
          setSelectedIndex(next);
          itemRefs.current.get(next)?.scrollIntoView({ block: 'nearest' });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev =
            selectedIndex > 0 ? selectedIndex - 1 : results.length - 1;
          setSelectedIndex(prev);
          itemRefs.current.get(prev)?.scrollIntoView({ block: 'nearest' });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const selected = results[selectedIndex];
          if (selectedIndex >= 0 && selected) {
            navigateToMovie(selected);
          }
          break;
        }
      }
    },
    [results, selectedIndex, navigateToMovie],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.15 } }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 25,
              mass: 0.8,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t('search.open')}
            onKeyDown={handleKeyDown}
            className="fixed inset-x-4 top-20 z-101 mx-auto flex max-w-xl flex-col rounded-2xl shadow-[0_0_0_1px_rgba(245,180,91,0.08),0_24px_64px_-16px_rgba(0,0,0,0.65)] md:inset-x-auto md:left-1/2 md:top-32 md:w-full md:-translate-x-1/2"
          >
            <div className="relative flex flex-col overflow-hidden rounded-2xl bg-card">
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
                style={{
                  background:
                    'linear-gradient(90deg, oklch(from var(--primary) l c h / 0.5), oklch(from var(--primary) l c h / 0.65), oklch(from var(--primary) l c h / 0.8), var(--primary), oklch(from var(--primary) l c h / 0.8), oklch(from var(--primary) l c h / 0.65), oklch(from var(--primary) l c h / 0.5))',
                  backgroundSize: '200% 100%',
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '2px',
                }}
              />
            <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-amber-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.inputPlaceholder')}
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-palette-listbox"
                aria-activedescendant={
                  selectedIndex >= 0
                    ? `search-result-${selectedIndex}`
                    : undefined
                }
                aria-autocomplete="list"
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={t('search.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                ESC
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isLoading
                    ? 'loading'
                    : error
                      ? 'error'
                      : `results-${debouncedQuery}`
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {results.length > 0 ? (
                  <div
                    role="listbox"
                    id="search-palette-listbox"
                    className="max-h-[min(50vh,28rem)] overflow-y-auto py-1"
                  >
                    {results.map((movie, idx) => (
                      <SearchResultItem
                        key={movie.id}
                        movie={movie}
                        locale={locale}
                        index={idx}
                        isSelected={idx === selectedIndex}
                        onClick={() => navigateToMovie(movie)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        itemRef={(el) => {
                          if (el) itemRefs.current.set(idx, el);
                          else itemRefs.current.delete(idx);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <SearchEmptyState
                    query={query}
                    debouncedQuery={debouncedQuery}
                    isLoading={isLoading}
                    isQueryValid={isQueryValid}
                    error={error}
                    hasResults={results.length > 0}
                    t={t}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
