'use client';

import { cn } from '@repo/ui/lib/utils';
import { Slider as SliderPrimitive } from 'radix-ui';
import * as React from 'react';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-white/8 shadow-[inset_0_1px_2px_oklch(0_0_0/0.5)] data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute rounded-full bg-linear-to-r from-primary/50 to-primary shadow-[0_0_12px_oklch(0.76_0.13_65/0.6)] select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block h-4 w-6 shrink-0 cursor-grab rounded-full bg-white shadow-[0_0_0_3px_oklch(0.76_0.13_65/0.25),0_0_18px_oklch(0.76_0.13_65/0.55)] ring-1 ring-black/10 transition-[color,box-shadow,background-color,scale] duration-200 select-none not-dark:bg-clip-padding hover:scale-110 hover:ring-4 hover:ring-ring/30 active:cursor-grabbing active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-vertical:h-6 data-vertical:w-4"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
