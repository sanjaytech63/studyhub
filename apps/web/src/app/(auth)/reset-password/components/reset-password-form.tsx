'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AuthCard, AuthFooter, PasswordField } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';

import { getApiErrorMessage } from '@/lib/api/api-error';
import { useResetPasswordMutation } from '@/lib/auth/auth.mutations';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth/auth.schemas';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token')?.trim() ?? '';

  const [completed, setCompleted] = useState(false);

  const mutation = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      password: '',
      confirmPassword: '',
    },

    mode: 'onSubmit',
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error('This password reset link is invalid or expired.');

      return;
    }

    try {
      await mutation.mutateAsync({
        token,
        password: values.password,
      });

      setCompleted(true);

      toast.success('Your password has been reset successfully.');

      form.reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to reset your password.'));
    }
  }

  /*
   * =========================================================
   * INVALID TOKEN
   * =========================================================
   */

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is missing or no longer valid."
        footer={
          <AuthFooter message="Need a new link?" label="Reset password" href="/forgot-password" />
        }
      >
        <Button
          type="button"
          className="w-full h-9"
          onClick={() => router.replace('/forgot-password')}
        >
          Request new link
        </Button>
      </AuthCard>
    );
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
      title="Create a new password"
      description="Choose a strong password that you haven't used before."
      footer={<AuthFooter message="Remember your password?" label="Login" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <PasswordField
          id="password"
          label="New password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

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
          loadingText="Updating password..."
          className="w-fit"
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

/*
 * =========================================================
 * PASSWORD REQUIREMENTS
 * =========================================================
 */

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
