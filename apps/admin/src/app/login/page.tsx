'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { login, getMe } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { getAccessToken, getApiErrorMessage } from '@/lib/api/api-client';
import { loginSchema, type LoginFormValues } from '@/lib/admin/auth.schema';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, initialize } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    let isMounted = true;
    initialize();

    const checkAuth = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      const token = getAccessToken();
      if (token) {
        try {
          const userData = await getMe();
          if (!isMounted) return;
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatarUrl: userData.avatarUrl,
            roleId: userData.role?.id,
            role: userData.role,
          });
          router.replace('/dashboard');
          return;
        } catch {
          // Continue to display login form
        }
      }

      if (isMounted) {
        setIsCheckingAuth(false);
      }
    };

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [initialize, router, setUser]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const authData = await login({ email: values.email, password: values.password });
      setUser({
        id: authData.user.id,
        email: authData.user.email,
        firstName: authData.user.firstName,
        lastName: authData.user.lastName,
        avatarUrl: authData.user.avatarUrl,
        roleId: authData.user.roleId,
      });

      toast.success('Authentication successful. Welcome to StudyHub Admin.');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Invalid credentials or unauthorized access.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-106 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-106 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Emblem */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover shadow-xl shadow-primary/25 border border-primary/40 mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">StudyHub Admin</h1>
          <p className="mt-1.5 text-xs text-muted-foreground font-mono">
            Enterprise Management & Control Plane
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-7 shadow-2xl border-border/80 bg-card/85 backdrop-blur-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="email" required>
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@studyhub.com"
                {...form.register('email')}
                error={form.formState.errors.email?.message}
                leftIcon={<Mail className="h-4 w-4" />}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" required>
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...form.register('password')}
                error={form.formState.errors.password?.message}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer hover:text-foreground text-muted-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full font-semibold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In to Console
              </Button>
            </div>
          </form>

          {/* Security Banner */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-secondary/30 p-2.5 text-[11px] text-muted-foreground border border-border/50">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Authorized administrator access only. Session activity logged.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
