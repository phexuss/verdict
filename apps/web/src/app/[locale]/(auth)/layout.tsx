import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

async function hasCurrentUser() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return false;
  }

  const requestHeaders = await headers();
  const cookie = requestHeaders.get('cookie');

  if (!cookie) {
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/me`, {
      cache: 'no-store',
      headers: {
        cookie,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;

  if (await hasCurrentUser()) {
    redirect(`/${locale}/profile`);
  }

  return (
    <main className="px-5 py-8 md:px-20 md:py-12 xl:px-30 xl:py-16">
      {children}
    </main>
  );
}
