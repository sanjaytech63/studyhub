'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiErrorState } from '@/components/feedback/api-error-state';
import { Loading } from '@/components/feedback/loading-state';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { profileQueryOptions } from '@/lib/profile/profile.queries';
import { useUpdateProfileMutation } from '@/lib/profile/profile.mutations';
import type { ProfileFormValues } from '@/lib/profile/profile.schema';
import { ProfileHeader } from './profile-header';
import { ProfileForm } from './profile-form';
import { SecurityCard } from './security-card';
import { AccountDetails } from './account-details';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const profileQuery = useQuery(profileQueryOptions);
  const updateProfileMutation = useUpdateProfileMutation();

  if (profileQuery.isPending) {
    return <Loading message="Loading your profile..." />;
  }

  if (profileQuery.isError) {
    return (
      <section aria-labelledby="profile-title" className="space-y-6">
        <PageHeader />

        <ApiErrorState
          error={profileQuery.error}
          title="Unable to load your profile"
          onRetry={() => void profileQuery.refetch()}
        />
      </section>
    );
  }

  const profile = profileQuery.data;

  async function handleSubmit(values: ProfileFormValues) {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || null,
      });

      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update your profile.'));
    }
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <section aria-labelledby="profile-title" className="space-y-6">
      <PageHeader />

      <div className="grid gap-6">
        {/* Profile identity */}
        <ProfileHeader profile={profile} isEditing={isEditing} onEdit={() => setIsEditing(true)} />

        {/* Editable profile */}
        {isEditing && (
          <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 px-6 py-5">
              <h2 className="text-base font-semibold">Personal information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the name associated with your StudyHub account.
              </p>
            </div>

            <div className="p-6">
              <ProfileForm
                profile={profile}
                isEditing
                isSubmitting={updateProfileMutation.isPending}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Account information */}
        {!isEditing && <AccountDetails profile={profile} />}

        {/* Security */}
        <SecurityCard />
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <header>
      <h1 id="profile-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Profile Overview
      </h1>

      <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Manage your personal information, account status, and security settings.
      </p>
    </header>
  );
}
