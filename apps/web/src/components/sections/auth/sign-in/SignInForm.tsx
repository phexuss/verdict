'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Field, FieldLabel } from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignInInput, signInSchema } from '@/features/auth/schemas';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import SignInPasswordInput from './SignInPasswordInput';

export default function SignInForm() {
  const t = useTranslations('SignInPage');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignInInput) {
    setServerError(null);

    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      setServerError(
        result.error.message ??
          'An error occurred while signing in. Please try again.',
      );
      return;
    }

    router.push('/profile');
    router.refresh();
  }

  return (
    <form
      className="space-y-4 w-full max-w-md"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field>
        <FieldLabel htmlFor="email">{t('emailLabel')}</FieldLabel>
        <Input
          className={`bg-accent rounded-md ${form.formState.errors.email ? 'border-destructive' : ''}`}
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
        {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
