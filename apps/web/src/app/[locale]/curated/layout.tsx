import type { ReactNode } from 'react';

type CuratedLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: CuratedLayoutProps) {
  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      {children}
    </main>
  );
}
