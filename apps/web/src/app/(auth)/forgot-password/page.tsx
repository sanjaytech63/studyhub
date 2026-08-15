'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthCard, AuthFooter } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth/auth.schemas';
import { useForgotPasswordMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { LoadingButton } from '@/components/ui/loading-button';

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
      toast.success('If an account exists, password reset instructions have been sent.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to process your request.'));
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title="Check your email"
        description="If an account exists for this email address, you will receive password reset instructions shortly."
        footer={<AuthFooter message="Remember your password?" label="Login" href="/login" />}
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            ✓
          </div>

          <p className="text-sm text-muted-foreground">
            Check your inbox and follow the instructions to reset your password.
          </p>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setSubmitted(false)}
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
      description="Enter your email address and we'll send you a secure password reset link."
      footer={<AuthFooter message="Remember your password?" label="Back to login" href="/login" />}
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
          />

          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Sending.."
          className="w-full"
        >
          Send reset link
        </LoadingButton>

        <Link
          href="/login"
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}
