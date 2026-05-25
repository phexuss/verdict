'use client';
import { Button } from '@repo/ui/components/button';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';

export default function GoogleLoginButton() {
  const locale = useLocale();
  const t = useTranslations('SignInPage');

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/${locale}/profile`,
      errorCallbackURL: `${window.location.origin}/${locale}/sign-in?error=oauth`,
      newUserCallbackURL: `${window.location.origin}/${locale}/profile`,
    });
  }

  return (
    <Button
      onClick={signInWithGoogle}
      type="button"
      className="w-full max-w-md flex items-center justify-center gap-2.5"
    >
      <Image
        src="/socials/google.svg"
        alt="Google Icon"
        width={18}
        height={18}
        className="invert"
      />
      {t('googleSignIn')}
    </Button>
  );
}
