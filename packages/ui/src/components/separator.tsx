'use client';

import { cn } from '@repo/ui/lib/utils';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import * as React from 'react';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-muted data-horizontal:h-px data-horizontal:w-[calc(100%-2rem)] mx-5 data-vertical:w-px data-vertical:self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
