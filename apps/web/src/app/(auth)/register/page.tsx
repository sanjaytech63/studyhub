'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthCard, AuthFooter, PasswordField, SocialAuth } from '@/components/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormValues } from '@/lib/auth/auth.schemas';
import { useRegisterMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { LoadingButton } from '@/components/ui/loading-button';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const mutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await mutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success('Account created. Check your email for the verification code.');

      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
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
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>

          <Input id="name" placeholder="John Doe" autoComplete="name" {...form.register('name')} />

          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...form.register('email')}
          />

          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={form.watch('terms')}
            onCheckedChange={(checked) =>
              form.setValue('terms', checked === true, {
                shouldValidate: true,
              })
            }
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

            {form.formState.errors.terms ? (
              <p className="text-xs text-destructive">{form.formState.errors.terms.message}</p>
            ) : null}
          </div>
        </div>

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
