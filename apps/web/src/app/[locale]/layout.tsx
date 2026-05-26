import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { QueryProvider } from '@/providers/query-provider';
import '@repo/ui/globals.css';
import Footer from '@/components/sections/footer/Footer';
import Header from '@/components/sections/header/Header';

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Verdict',
  description:
    'A clean modern starter powered by Next.js, NestJS and Turborepo.',
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
    <html lang={locale} className={jost.variable}>
      <body className="min-h-svh bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] font-sans text-foreground antialiased md:pb-0">
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
