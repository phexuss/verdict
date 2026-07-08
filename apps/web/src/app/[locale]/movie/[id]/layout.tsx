import type { ReactNode } from 'react';

type CuratedSlugLayoutProps = {
  children: ReactNode;
};

export default function CuratedSlugLayout({
  children,
}: CuratedSlugLayoutProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 40% at 50% -5%, oklch(0.76 0.13 65 / 0.13) 0%, transparent 70%)',
            'radial-gradient(ellipse 32% 65% at -4% 30%, oklch(0.76 0.13 65 / 0.08) 0%, transparent 65%)',
            'radial-gradient(ellipse 32% 65% at 104% 30%, oklch(0.76 0.13 65 / 0.08) 0%, transparent 65%)',
          ].join(', '),
        }}
      />
      <main className="relative z-10 px-5 pb-8 pt-12 md:px-20 md:pb-12 md:pt-16 xl:px-30 xl:pb-16 xl:pt-20">
        {children}
      </main>
    </div>
  );
}
