'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard, AuthFooter, SocialAuth } from '@/components/auth';
import { LoadingButton } from '@/components/ui/loading-button';
import { loginSchema, type LoginFormValues } from '@/lib/auth/auth.schemas';
import { useLoginMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

export default function LoginPage() {
  const router = useRouter();
  const mutation = useLoginMutation();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await mutation.mutateAsync(values);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      router.replace(callbackUrl);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign in.'));
    }
  }

  return (
    <AuthCard
      title="Welcome back!"
      description="Sign in to continue your learning journey."
      footer={<AuthFooter message="Don't have an account?" label="Sign up" href="/register" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register('email')}
            aria-invalid={Boolean(form.formState.errors.email)}
          />

          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...form.register('password')}
            aria-invalid={Boolean(form.formState.errors.password)}
          />

          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Signing in..."
          className="w-full"
        >
          Sign in
        </LoadingButton>

        <SocialAuth />
      </form>
    </AuthCard>
  );
}
