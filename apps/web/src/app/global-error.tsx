'use client';

import { Jost } from 'next/font/google';
import '@repo/ui/globals.css';
import ErrorScene from '@/components/motion/error/ErrorScene';

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jost',
  display: 'swap',
});

type GlobalErrorProps = {
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en" className={jost.variable}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ErrorScene
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          retryLabel="Try again"
          homeLabel="Back to Home"
          onRetry={reset}
        />
      </body>
    </html>
  );
}
