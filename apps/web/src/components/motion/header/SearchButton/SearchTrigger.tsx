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
      className="group flex size-9 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-accent"
      aria-label={t('search.open')}
    >
      <Search className="size-5" />
    </button>
  );
}
