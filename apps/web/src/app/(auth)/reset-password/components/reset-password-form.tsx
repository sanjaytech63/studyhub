'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AuthCard, AuthFooter, PasswordField } from '@/components/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';

import { getApiErrorMessage } from '@/lib/api/api-error';

import { useResetPasswordMutation } from '@/lib/auth/auth.mutations';

import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth/auth.schemas';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get('email')?.trim() ?? '';

  const [completed, setCompleted] = useState(false);

  const mutation = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      email: emailFromQuery,
      otp: '',
      password: '',
      confirmPassword: '',
    },

    mode: 'onSubmit',
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      await mutation.mutateAsync({
        email: values.email,
        otp: values.otp,
        password: values.password,
      });

      setCompleted(true);

      form.reset();

      toast.success('Your password has been reset successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to reset your password.'));
    }
  }

  /*
   * =========================================================
   * SUCCESS
   * =========================================================
   */

  if (completed) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been changed successfully. You can now sign in with your new password."
      >
        <Button type="button" className="w-full" onClick={() => router.replace('/login')}>
          Continue to login
        </Button>
      </AuthCard>
    );
  }

  /*
   * =========================================================
   * FORM
   * =========================================================
   */

  return (
    <AuthCard
      title="Reset your password"
      description="Enter the verification code sent to your email and create a new password."
      footer={<AuthFooter message="Remember your password?" label="Login" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* EMAIL */}

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

        {/* OTP */}

        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>

          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            {...form.register('otp')}
            aria-invalid={Boolean(form.formState.errors.otp)}
          />

          {form.formState.errors.otp && (
            <p className="text-xs text-destructive">{form.formState.errors.otp.message}</p>
          )}

          <p className="text-xs text-muted-foreground">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        {/* NEW PASSWORD */}

        <PasswordField
          id="password"
          label="New password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        {/* CONFIRM PASSWORD */}

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />

        <PasswordRequirements />

        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Resetting password..."
          className="w-full"
        >
          Reset password
        </LoadingButton>

        <Link
          href="/login"
          className="block text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}

function PasswordRequirements() {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <p className="text-xs font-medium">Password requirements</p>

      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        <li>• At least 8 characters</li>
        <li>• One uppercase letter</li>
        <li>• One lowercase letter</li>
        <li>• One number</li>
        <li>• One special character</li>
      </ul>
    </div>
  );
}
