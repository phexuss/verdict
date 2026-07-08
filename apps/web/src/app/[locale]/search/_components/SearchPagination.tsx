'use client';

import { Button } from '@repo/ui/components/button';
import { AltArrowLeftBold, AltArrowRightBold } from '@solar-icons/react-perf';
import { useId } from 'react';
import { useRouter } from '@/i18n/navigation';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
}

export function SearchPagination({
  currentPage,
  totalPages,
  query,
}: SearchPaginationProps) {
  const router = useRouter();
  const ellipsisId = useId();

  const navigate = (page: number) => {
    const params = new URLSearchParams({ q: query });
    if (page > 1) params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  const getPageNumbers = (): Array<{ type: 'page'; value: number } | { type: 'ellipsis'; id: string }> => {
    const items: Array<{ type: 'page'; value: number } | { type: 'ellipsis'; id: string }> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: 'page', value: i });
      }
      return items;
    }

    items.push({ type: 'page', value: 1 });

    if (currentPage > 3) {
      items.push({ type: 'ellipsis', id: `${ellipsisId}-start` });
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      items.push({ type: 'page', value: i });
    }

    if (currentPage < totalPages - 2) {
      items.push({ type: 'ellipsis', id: `${ellipsisId}-end` });
    }

    items.push({ type: 'page', value: totalPages });

    return items;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Search pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-9 w-9"
      >
        <AltArrowLeftBold className="h-4 w-4" />
      </Button>

      {pages.map((item) =>
        item.type === 'ellipsis' ? (
          <span
            key={item.id}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground text-sm"
          >
            ...
          </span>
        ) : (
          <Button
            key={item.value}
            variant={item.value === currentPage ? 'default' : 'outline'}
            size="icon"
            onClick={() => navigate(item.value)}
            disabled={item.value === currentPage}
            aria-label={`Page ${item.value}`}
            aria-current={item.value === currentPage ? 'page' : undefined}
            className="h-9 w-9"
          >
            {item.value}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-9 w-9"
      >
        <AltArrowRightBold className="h-4 w-4" />
      </Button>
    </nav>
  );
}
