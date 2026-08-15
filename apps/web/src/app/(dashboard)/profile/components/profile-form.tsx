'use client';

import { useEffect } from 'react';
import { Form, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { profileSchema, type ProfileFormValues } from '@/lib/profile/profile.schema';
import type { Profile } from '@/lib/profile/profile.types';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ProfileFormProps {
  readonly profile: Profile;
  readonly isEditing: boolean;
  readonly isSubmitting: boolean;
  readonly onSubmit: (values: ProfileFormValues) => Promise<void>;
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
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
    },
    mode: 'onBlur',
  });

  /*
   * Keep form synchronized with server data.
   *
   * Useful when profile data is refetched or replaced.
   */
  useEffect(() => {
    form.reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
    });
  }, [profile, form]);

  const handleSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    await onSubmit(values);
  };

  function handleCancel() {
    form.reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
    });

    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-7 space-y-5" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing || isSubmitting}
                  autoComplete="name"
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={!isEditing || isSubmitting}
                  autoComplete="email"
                  placeholder="Enter your email address"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  disabled={!isEditing || isSubmitting}
                  placeholder="Tell us a little about yourself"
                  rows={4}
                  className="resize-none"
                />
              </FormControl>

              <div className="flex justify-between gap-4">
                <FormMessage />

                <span className="ml-auto text-xs text-muted-foreground">
                  {field.value.length}/500
                </span>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing || isSubmitting}
                  autoComplete="address-level2"
                  placeholder="e.g. New York, USA"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
