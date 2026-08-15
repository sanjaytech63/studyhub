'use client';

import { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { PasswordRequirements } from './password-requirements';
import { PasswordField } from './password-field';

import { useChangePasswordMutation } from '@/lib/profile/profile.mutations';
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from '@/lib/profile/change-password.schema';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { FormField } from '@/components/ui/form';
export function ChangePasswordCard() {
  const [open, setOpen] = useState(false);

  const mutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    mode: 'onBlur',
  });

  async function handleSubmit(values: ChangePasswordFormValues) {
    try {
      await mutation.mutateAsync(values);

      toast.success('Your password has been changed successfully.');

      form.reset();

      setOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to change password. Please try again.'));
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  }

  return (
    <>
      {/* =================================================
          SECURITY CARD
          ================================================= */}

      <section aria-labelledby="change-password-title" className="border-t border-border pt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>

            <div className="min-w-0">
              <h2 id="change-password-title" className="text-sm font-semibold">
                Change Password
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                Update your password regularly to help keep your account secure.
              </p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                  Change Password
                </Button>
              }
            />

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound aria-hidden="true" className="size-5" />
                </div>

                <DialogTitle>Change your password</DialogTitle>

                <DialogDescription>
                  Enter your current password and choose a new password for your account.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5" noValidate>
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <PasswordField
                        field={field}
                        label="Current password"
                        placeholder="Enter your current password"
                        disabled={mutation.isPending}
                        autoComplete="current-password"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <PasswordField
                        field={field}
                        label="New password"
                        placeholder="Enter your new password"
                        disabled={mutation.isPending}
                        autoComplete="new-password"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <PasswordField
                        field={field}
                        label="Confirm new password"
                        placeholder="Re-enter your new password"
                        disabled={mutation.isPending}
                        autoComplete="new-password"
                      />
                    )}
                  />

                  <PasswordRequirements />

                  <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={mutation.isPending}
                      onClick={() => handleOpenChange(false)}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Updating...' : 'Update Password'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
