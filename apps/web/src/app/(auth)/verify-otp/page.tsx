'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthCard, AuthFooter } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { verifyOtpSchema, type VerifyOtpFormValues } from '@/lib/auth/auth.schemas';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { OtpInput } from '@/components/auth/otp-input';
import { LoadingButton } from '@/components/ui/loading-button';

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  async function onSubmit(values: VerifyOtpFormValues) {
    if (!email) {
      toast.error('Verification email is missing.');
      return;
    }

    try {
      await verifyMutation.mutateAsync({
        email,
        otp: values.otp,
      });

      toast.success('Your email has been verified.');

      router.replace('/login');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'The verification code is invalid or expired.'));
    }
  }

  async function handleResend() {
    if (!email || countdown > 0) {
      return;
    }

    try {
      await resendMutation.mutateAsync(email);

      setCountdown(RESEND_SECONDS);

      form.reset({
        otp: '',
      });

      toast.success('A new verification code has been sent.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to resend the verification code.'));
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      description={
        email
          ? `Enter the 6-digit code sent to ${email}.`
          : 'Enter the 6-digit code sent to your email.'
      }
      footer={<AuthFooter message="Already verified?" label="Back to login" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <OtpInput
          value={form.watch('otp')}
          onChange={(value) =>
            form.setValue('otp', value, {
              shouldValidate: true,
            })
          }
          disabled={verifyMutation.isPending}
          error={form.formState.errors.otp?.message}
        />

        <LoadingButton
          type="submit"
          disabled={verifyMutation.isPending || form.watch('otp').length !== 6}
          loading={verifyMutation.isPending}
          loadingText="Verifying..."
          className="w-full"
        >
          Verify email
        </LoadingButton>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Didn&apos;t receive the code?</p>

          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={countdown > 0 || resendMutation.isPending || !email}
            onClick={handleResend}
          >
            {resendMutation.isPending
              ? 'Sending...'
              : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend code'}
          </Button>
        </div>

        <Link
          href="/register"
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Use a different email
        </Link>
      </form>
    </AuthCard>
  );
}
