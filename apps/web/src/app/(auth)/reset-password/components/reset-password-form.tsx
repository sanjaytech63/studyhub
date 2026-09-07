'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { ShieldAlert } from 'lucide-react';
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
      const res = await mutation.mutateAsync({
        email: values.email,
        otp: values.otp,
        newPassword: values.password,
      });

      setCompleted(true);

      form.reset();

      toast.success(res?.message || 'Your password has been reset successfully.');
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* EMAIL */}

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 text-sm font-medium"
            {...form.register('email')}
            aria-invalid={Boolean(form.formState.errors.email)}
          />

          {form.formState.errors.email && (
            <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
              <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
              <span>{form.formState.errors.email.message}</span>
            </p>
          )}
        </div>

        {/* OTP */}

        <div className="space-y-1.5">
          <Label
            htmlFor="otp"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Verification code
          </Label>

          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="h-11 text-sm font-medium"
            {...form.register('otp')}
            aria-invalid={Boolean(form.formState.errors.otp)}
          />

          {form.formState.errors.otp && (
            <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
              <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
              <span>{form.formState.errors.otp.message}</span>
            </p>
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
          className="h-11 w-full text-sm font-bold shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35"
        >
          Reset password
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
