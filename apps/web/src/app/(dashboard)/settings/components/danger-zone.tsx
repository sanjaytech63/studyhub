'use client';

import { LogOut, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { useLogoutMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

export function DangerZone() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();

      toast.success('You have been signed out.');

      setOpen(false);

      router.replace('/login');
      router.refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign out. Please try again.'));
    }
  }

  return (
    <section
      aria-labelledby="danger-zone-title"
      className="rounded-xl border border-destructive/20 bg-destructive/3"
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 id="danger-zone-title" className="text-sm font-semibold">
              Sign out
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
              Sign out from your current StudyHub session on this device.
            </p>
          </div>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of StudyHub?</AlertDialogTitle>

              <AlertDialogDescription>
                You will need to sign in again to access your dashboard, courses, projects, and
                account settings.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={logoutMutation.isPending}>Cancel</AlertDialogCancel>

              <AlertDialogAction
                disabled={logoutMutation.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
              >
                {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
