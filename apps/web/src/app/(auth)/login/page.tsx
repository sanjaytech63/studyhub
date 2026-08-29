'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';

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

  const [showPassword, setShowPassword] = React.useState(false);

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
      toast.error(getApiErrorMessage(error, 'Unable to sign in. Please check your credentials.'));
    }
  }

  return (
    <AuthCard
      title="Welcome back!"
      description="Enter your credentials to access your account."
      footer={<AuthFooter message="Don't have an account?" label="Sign up" href="/register" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Address Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Email address
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-primary"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`peer h-11 pl-10 pr-4 text-sm font-medium transition-all ${
                form.formState.errors.email
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : 'focus-visible:ring-primary/20'
              }`}
              {...form.register('email')}
              aria-invalid={Boolean(form.formState.errors.email)}
            />
          </div>

          {form.formState.errors.email && (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <ShieldAlert className="size-3.5 shrink-0" />
              <span>{form.formState.errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </Label>

            <Link
              href="/forgot-password"
              className="text-xs font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-primary"
            />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className={`peer h-11 pl-10 pr-10 text-sm font-medium transition-all ${
                form.formState.errors.password
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : 'focus-visible:ring-primary/20'
              }`}
              {...form.register('password')}
              aria-invalid={Boolean(form.formState.errors.password)}
            />

            {/* Interactive Password Visibility Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {form.formState.errors.password && (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <ShieldAlert className="size-3.5 shrink-0" />
              <span>{form.formState.errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Authenticating..."
          className="h-11 w-full text-sm font-bold shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35"
        >
          Sign in
        </LoadingButton>

        {/* Third-Party Social Auth Divider & Options */}
        <SocialAuth />
      </form>
    </AuthCard>
  );
}
