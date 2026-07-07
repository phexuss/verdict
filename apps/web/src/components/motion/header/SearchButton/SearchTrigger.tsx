import { Search } from 'lucide-react';

interface SearchTriggerProps {
  onClick: () => void;
  t: (key: string) => string;
}

export function SearchTrigger({ onClick, t }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex size-10 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-accent md:w-auto md:justify-start md:gap-2 md:border md:border-border md:bg-card/80 md:px-3.5 md:text-muted-foreground md:backdrop-blur-md md:hover:border-amber-500/30 md:hover:bg-muted md:hover:text-foreground"
      aria-label={t('search.open')}
    >
      <Search className="size-5 shrink-0 md:size-4" />
      <span className="hidden text-sm md:inline">
        {t('search.buttonPlaceholder')}
      </span>
    </button>
  );
}
