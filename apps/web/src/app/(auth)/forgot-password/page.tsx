'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, ShieldAlert } from 'lucide-react';
import { AuthCard, AuthFooter } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth/auth.schemas';
import { useForgotPasswordMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),

    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await mutation.mutateAsync(values);
      setSubmitted(true);
      toast.success('If an account exists, a password reset OTP has been sent.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to process your request.'));
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title="Check your email"
        description="If an account exists for this email address, a password reset OTP has been sent."
        footer={<AuthFooter message="Remember your password?" label="Login" href="/login" />}
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            ✓
          </div>

          <p className="text-sm text-muted-foreground">
            Check your inbox for the 6-digit verification code. You will need this code on the
            password reset screen.
          </p>

          <Button asChild className="w-full">
            <Link
              href={`/reset-password?email=${encodeURIComponent(
                form.getValues('email').trim().toLowerCase(),
              )}`}
            >
              Enter OTP & Reset Password
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setSubmitted(false);
              form.reset();
            }}
          >
            Try another email
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a secure password reset OTP."
      footer={<AuthFooter message="Remember your password?" label="Back to login" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
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
            <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
              <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
              <span>{form.formState.errors.email.message}</span>
            </p>
          )}
        </div>

        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Sending OTP..."
          className="h-11 w-full text-sm font-bold shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35"
        >
          Send reset OTP
        </LoadingButton>

        <Button
          asChild
          variant="ghost"
          className="h-10 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/login">Back to login</Link>
        </Button>
      </form>
    </AuthCard>
  );
}
