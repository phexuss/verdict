'use client';

import { Button } from '@repo/ui/components/button';
import { useLocale } from 'next-intl';
import { authClient } from '@/lib/auth-client';

export default function GoogleSignInButton() {
  const locale = useLocale();

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `/${locale}/test`,
      errorCallbackURL: `/${locale}/sign-in?error=oauth`,
      newUserCallbackURL: `/${locale}/test`,
    });
  }

  return (
    <Button type="button" variant="outline" onClick={signInWithGoogle}>
      Continue with Google
    </Button>
  );
}
