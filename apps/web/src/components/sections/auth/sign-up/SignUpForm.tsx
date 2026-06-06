'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Field, FieldLabel } from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignUpInput, signUpSchema } from '@/features/auth/schemas';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import GoogleLoginButton from '../sign-in/GoogleLoginButton';
import SignInPasswordInput from '../sign-in/SignInPasswordInput';

export default function SignUpForm() {
  const t = useTranslations('SignUpPage');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignUpInput) {
    setServerError(null);

    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      setServerError(
        result.error.message ??
          'An error occurred while signing up. Please try again.',
      );
      return;
    }

    router.push('/profile');
    router.refresh();
  }

  return (
    <form
      noValidate
      className="space-y-4 w-full max-w-md"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field>
        <FieldLabel htmlFor="name">{t('nameLabel')}</FieldLabel>
        <Input
          className={`bg-accent rounded-md ${form.formState.errors.name ? 'border-destructive' : ''}`}
          id="name"
          type="text"
          placeholder="Alex"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">{t('emailLabel')}</FieldLabel>
        <Input
          className={`bg-accent rounded-md ${form.formState.errors.email ? 'border-destructive' : ''}`}
          id="email"
          type="email"
          placeholder="name@example.com"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">{t('passwordLabel')}</FieldLabel>
        <SignInPasswordInput
          className={`bg-accent rounded-md ${form.formState.errors.password ? 'border-destructive' : ''}`}
          id="password"
          {...form.register('password')}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </Field>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button
        className="w-full max-w-md"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? `${t('titleLoading')}` : `${t('title')}`}
      </Button>
      <GoogleLoginButton label={t('googleSignUp')} />

      <p className="text-center text-muted-foreground text-sm">
        {t.rich('signInPrompt', {
          signIn: (chunks) => (
            <Link
              href="/sign-in"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
