import type { ReactNode } from 'react';

type CuratedLayoutProps = {
  children: ReactNode;
};

export default function CuratedLayout({ children }: CuratedLayoutProps) {
  return <>{children}</>;
}
