import { Jost } from 'next/font/google';
import NotFoundScene from '@/components/motion/not-found/NotFoundScene';
import '@repo/ui/globals.css';

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jost',
  display: 'swap',
});

// Rendered outside [locale] (e.g. an unsupported locale), so it brings its
// own document.
export default function NotFoundPage() {
  return (
    <html lang="en" className={jost.variable}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <NotFoundScene
          title="Page Not Found"
          description="The page you are looking for does not exist or has been moved."
          ctaLabel="Back to Home"
        />
      </body>
    </html>
  );
}
