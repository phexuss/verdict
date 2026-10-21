import { Toaster } from '@repo/ui/components/sonner';
import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import Footer from '@/components/sections/footer/Footer';
import Header from '@/components/sections/header/Header';
import { routing } from '@/i18n/routing';
import { UI_MODE_BOOT_SCRIPT } from '@/lib/ui-mode';
import { QueryProvider } from '@/providers/query-provider';
import '@repo/ui/globals.css';

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://verdict.phexuss.dev'),
  title: {
    default: 'Verdict',
    template: '%s — Verdict',
  },
  description:
    'Verdict builds your cinematic portrait from films you save, watch and rate — then picks what to watch tonight.',
  keywords: [
    'movies',
    'film recommendations',
    'cinematic profile',
    'what to watch',
    'movie taste',
  ],
  authors: [{ name: 'phexuss', url: 'https://github.com/phexuss' }],
  creator: 'phexuss',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    siteName: 'Verdict',
    title: 'Verdict',
    description:
      'Verdict builds your cinematic portrait from films you save, watch and rate — then picks what to watch tonight.',
    url: 'https://verdict.phexuss.dev',
  },
  twitter: {
    card: 'summary',
    title: 'Verdict',
    description:
      'Verdict builds your cinematic portrait from films you save, watch and rate — then picks what to watch tonight.',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

// The document lives under [locale] so that switching languages re-renders
// <html lang>, the header and the intl provider, not just the page below them.
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={jost.variable} suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script that applies the saved UI mode before first paint
          dangerouslySetInnerHTML={{ __html: UI_MODE_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-svh bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] font-sans text-foreground antialiased md:pb-0">
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
