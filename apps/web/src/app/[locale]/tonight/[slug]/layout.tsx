import type { ReactNode } from 'react';

type TonightSlugLayoutProps = {
  children: ReactNode;
};

export default function TonightSlugLayout({
  children,
}: TonightSlugLayoutProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 80% 38% at 50% -2%, oklch(0.76 0.13 65 / 0.13) 0%, transparent 70%)',
            'radial-gradient(ellipse 35% 60% at -4% 35%, oklch(0.76 0.13 65 / 0.08) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 60% at 104% 35%, oklch(0.76 0.13 65 / 0.08) 0%, transparent 65%)',
          ].join(', '),
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
