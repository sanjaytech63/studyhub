'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, ShieldAlert, User } from 'lucide-react';

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

  const passwordValue = form.watch('password') || '';

  // Dynamic Password Strength Calculator
  const passwordStrength = React.useMemo(() => {
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return score;
  }, [passwordValue]);

  async function onSubmit(values: RegisterFormValues) {
    try {
      await mutation.mutateAsync(values);
      toast.success('Account created successfully! Please check your email to verify.');
      router.push(`/verify-otp?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to create your account. Please try again.'));
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join thousands of students and start learning on StudyHub."
      footer={<AuthFooter message="Already have an account?" label="Log in" href="/login" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="firstName"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              First name
            </Label>
            <div className="relative">
              <User
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
              />
              <Input
                id="firstName"
                placeholder="John"
                autoComplete="given-name"
                className={`h-11 pl-10 text-sm font-medium transition-all ${
                  form.formState.errors.firstName
                    ? 'border-destructive focus-visible:ring-destructive/20'
                    : 'focus-visible:ring-primary/20'
                }`}
                {...form.register('firstName')}
                aria-invalid={Boolean(form.formState.errors.firstName)}
              />
            </div>
            {form.formState.errors.firstName && (
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                <ShieldAlert className="size-3 shrink-0" />
                <span>{form.formState.errors.firstName.message}</span>
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="lastName"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Last name
            </Label>
            <div className="relative">
              <User
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
              />
              <Input
                id="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                className={`h-11 pl-10 text-sm font-medium transition-all ${
                  form.formState.errors.lastName
                    ? 'border-destructive focus-visible:ring-destructive/20'
                    : 'focus-visible:ring-primary/20'
                }`}
                {...form.register('lastName')}
                aria-invalid={Boolean(form.formState.errors.lastName)}
              />
            </div>
            {form.formState.errors.lastName && (
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                <ShieldAlert className="size-3 shrink-0" />
                <span>{form.formState.errors.lastName.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
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
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`h-11 pl-10 text-sm font-medium transition-all ${
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
              <ShieldAlert className="size-3 shrink-0" />
              <span>{form.formState.errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />

          {/* Interactive Password Strength Indicator */}
          {passwordValue.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-muted">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full flex-1 transition-all duration-300 ${
                      idx < passwordStrength
                        ? passwordStrength <= 2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                Strength:{' '}
                <span className={passwordStrength <= 2 ? 'text-amber-500' : 'text-emerald-500'}>
                  {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />

        {/* Terms and Conditions Container */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:border-border">
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
                  className="mt-0.5 border-muted-foreground/40 data-[state=checked]:bg-primary"
                />
              )}
            />

            <div className="space-y-1">
              <Label
                htmlFor="terms"
                className="cursor-pointer text-xs leading-relaxed font-normal text-muted-foreground"
              >
                I agree to StudyHub&apos;s{' '}
                <Link
                  href="/terms"
                  className="font-bold text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-bold text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </Label>

              {form.formState.errors.terms && (
                <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                  <ShieldAlert className="size-3 shrink-0" />
                  <span>{form.formState.errors.terms.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          loadingText="Creating account..."
          className="h-11 w-full text-sm font-bold shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35"
        >
          Create Account
        </LoadingButton>

        {/* Social Authentication Provider Links */}
        <SocialAuth />
      </form>
    </AuthCard>
  );
}
