import { getTranslations } from 'next-intl/server';
import SignInForm from '@/components/sections/auth/sign-in/SignInForm';

export default async function SignInPage() {
  const t = await getTranslations('SignInPage');
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-full max-w-md">
        <header className="flex items-start justify-start flex-col mb-5.5">
          <h1 className="text-xl font-medium">{t('title')}</h1>
          <p>{t('description')}</p>
        </header>
        <SignInForm />
        <footer></footer>
      </div>
    </div>
  );
}
