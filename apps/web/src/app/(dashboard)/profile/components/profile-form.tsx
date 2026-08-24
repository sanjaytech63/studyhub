'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/lib/profile/profile.types';
import { profileSchema, type ProfileFormValues } from '@/lib/profile/profile.schema';

interface ProfileFormProps {
  readonly profile: Profile;
  readonly isEditing: boolean;
  readonly isSubmitting: boolean;
  readonly onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  readonly onCancel: () => void;
}

export function ProfileForm({
  profile,
  isEditing,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      firstName: profile.firstName,

      lastName: profile.lastName ?? '',
    },
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    form.reset({
      firstName: profile.firstName,

      lastName: profile.lastName ?? '',
    });
  }, [form, isEditing, profile.firstName, profile.lastName]);

  if (!isEditing) {
    return null;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>

          <Input
            id="firstName"
            autoComplete="given-name"
            disabled={isSubmitting}
            {...form.register('firstName')}
          />

          {form.formState.errors.firstName && (
            <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>

          <Input
            id="lastName"
            autoComplete="family-name"
            disabled={isSubmitting}
            {...form.register('lastName')}
          />

          {form.formState.errors.lastName && (
            <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
        <p className="text-sm font-medium">Email address</p>

        <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>

        <p className="mt-2 text-xs text-muted-foreground">
          Email changes are managed separately through account security.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
