'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AuthCard, AuthFooter, PasswordField, SocialAuth } from '@/components/auth';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingButton } from '@/components/ui/loading-button';

import { registerSchema, type RegisterFormValues } from '@/lib/auth/auth.schemas';

import { useRegisterMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

export default function RegisterPage() {
  const router = useRouter();

  const mutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await mutation.mutateAsync(values);
      toast.success('Account created successfully. Please verify your email.');
      router.push(`/verify-otp?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to create your account.'));
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start your learning journey with StudyHub."
      footer={<AuthFooter message="Already have an account?" label="Login" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>

          <Input
            id="firstName"
            placeholder="John"
            autoComplete="given-name"
            {...form.register('firstName')}
          />

          {form.formState.errors.firstName && (
            <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>

          <Input
            id="lastName"
            placeholder="Doe"
            autoComplete="family-name"
            {...form.register('lastName')}
          />

          {form.formState.errors.lastName && (
            <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...form.register('email')}
          />

          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        {/* Confirm Password */}
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />

        {/* Terms */}
        <div className="flex items-start gap-3">
          <Controller
            name="terms"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                disabled={mutation.isPending}
              />
            )}
          />

          <div className="space-y-1">
            <Label htmlFor="terms" className="cursor-pointer text-xs leading-5 font-normal">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-primary hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </Label>

            {form.formState.errors.terms && (
              <p className="text-xs text-destructive">{form.formState.errors.terms.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Creating account..."
          className="w-full"
        >
          Create account
        </LoadingButton>

        <SocialAuth />
      </form>
    </AuthCard>
  );
}
