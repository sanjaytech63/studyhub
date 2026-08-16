'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AuthCard, AuthFooter } from '@/components/auth';
import { OtpInput } from '@/components/auth/otp-input';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';

import { getApiErrorMessage } from '@/lib/api/api-error';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/lib/auth/auth.mutations';
import { verifyOtpSchema, type VerifyOtpFormValues } from '@/lib/auth/auth.schemas';

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email')?.trim() ?? '';

  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  const verifyMutation = useVerifyOtpMutation();

  const resendMutation = useResendOtpMutation();

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),

    defaultValues: {
      otp: '',
    },

    mode: 'onChange',
  });

  const otp = useWatch({
    control: form.control,
    name: 'otp',
    defaultValue: '',
  });

  /*
   * =========================================================
   * RESEND COUNTDOWN
   * =========================================================
   */

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [countdown]);

  /*
   * =========================================================
   * VERIFY OTP
   * =========================================================
   */

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
      router.refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'The verification code is invalid or expired.'));
    }
  }

  /*
   * =========================================================
   * RESEND OTP
   * =========================================================
   */

  async function handleResend() {
    if (!email || countdown > 0 || resendMutation.isPending) {
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

  /*
   * =========================================================
   * DERIVED STATE
   * =========================================================
   */

  const isOtpComplete = otp.length === OTP_LENGTH;

  const isVerifyDisabled = !isOtpComplete || verifyMutation.isPending;

  const isResendDisabled = countdown > 0 || resendMutation.isPending || !email;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* =================================================
            OTP INPUT
            ================================================= */}

        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <OtpInput
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
              disabled={verifyMutation.isPending}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* =================================================
            VERIFY CTA
            ================================================= */}

        <LoadingButton
          type="submit"
          disabled={isVerifyDisabled}
          loading={verifyMutation.isPending}
          loadingText="Verifying..."
          className="w-full"
        >
          Verify email
        </LoadingButton>

        {/* =================================================
            RESEND
            ================================================= */}

        <div className="space-y-1 text-center">
          <p className="text-xs text-muted-foreground">Didn&apos;t receive the code?</p>

          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={isResendDisabled}
            onClick={handleResend}
          >
            {resendMutation.isPending
              ? 'Sending...'
              : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend code'}
          </Button>
        </div>

        {/* =================================================
            CHANGE EMAIL
            ================================================= */}

        <Link
          href="/register"
          className="block text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Use a different email
        </Link>
      </form>
    </AuthCard>
  );
}
