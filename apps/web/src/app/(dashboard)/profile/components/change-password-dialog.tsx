'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
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
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/profile/change-password.schema';

import { getApiErrorMessage } from '@/lib/api/api-error';

export function ChangePasswordDialog() {
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
      toast.success('Password changed successfully.');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to change your password.'));
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Change password
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="size-5" />
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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update password'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
