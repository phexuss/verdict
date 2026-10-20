import { cn } from '@repo/ui/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-2xl bg-muted/70 before:absolute before:inset-0 before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-white/[0.06] before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
