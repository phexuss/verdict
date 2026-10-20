import type { ReactNode } from 'react';

// The <html> document is rendered by app/[locale]/layout.tsx. This root layout
// only exists so that app/not-found.tsx has a parent.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
