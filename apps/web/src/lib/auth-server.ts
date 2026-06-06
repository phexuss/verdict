import { headers } from 'next/headers';

export async function hasCurrentUser() {
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
