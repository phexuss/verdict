'use client';

import { BuildingsBold } from '@solar-icons/react-perf';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type IdentityCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export default function IdentityCard({
  title,
  description,
  icon,
  className,
}: IdentityCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl surface p-4 text-foreground',
        className,
      )}
    >
      <div className="mb-5 shrink-0 text-primary drop-shadow-[0_0_10px_oklch(0.76_0.13_65/0.55)]">
        {icon ?? <BuildingsBold className="size-8 shrink-0" />}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <h3 className="line-clamp-2 wrap-break-word font-medium text-xl leading-tight">
          {title}
        </h3>
        <p className="line-clamp-6 wrap-break-word text-foreground/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
