'use client';

import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type SearchPaletteProps = {
  onSearch?: (query: string) => void;
};

export function SearchButton({ onSearch }: SearchPaletteProps) {
  const t = useTranslations('Header.navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch && query) onSearch(query);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex size-10 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-accent md:w-auto md:justify-start md:gap-2 md:border md:border-border md:bg-card/80 md:px-3.5 md:text-muted-foreground md:backdrop-blur-md md:hover:border-amber-500/30 md:hover:bg-muted md:hover:text-foreground"
        aria-label={t('search.open')}
      >
        <Search className="size-5 shrink-0 md:size-4" />
        <span className="hidden text-sm md:inline">
          {t('search.buttonPlaceholder')}
        </span>
      </button>

      {mounted &&
        createPortal(
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
                  initial={{ opacity: 0, scale: 0.96, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -12 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="fixed inset-x-4 top-20 z-101 mx-auto max-w-xl overflow-hidden rounded-2xl border border-amber-500/25 bg-card shadow-[0_0_0_1px_rgba(245,180,91,0.08),0_24px_64px_-16px_rgba(0,0,0,0.65)] md:inset-x-auto md:left-1/2 md:top-32 md:w-full md:-translate-x-1/2"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <Search className="h-5 w-5 shrink-0 text-amber-400" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('search.inputPlaceholder')}
                      className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={close}
                      className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={t('search.close')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
