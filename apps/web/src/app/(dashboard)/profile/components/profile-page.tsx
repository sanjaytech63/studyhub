'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiErrorState } from '@/components/feedback/api-error-state';
import { Loading } from '@/components/feedback/loading-state';

import { ProfileForm } from './profile-form';
import { ProfileHeader } from './profile-header';
import { ChangePasswordCard } from './change-password-card';

import { profileQueryOptions } from '@/lib/profile/profile.queries';
import { useUpdateProfileMutation } from '@/lib/profile/profile.mutations';
import { ProfileFormValues } from '@/lib/profile/profile.schema';
import { getApiErrorMessage } from '@/lib/api/api-error';

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
      await updateProfileMutation.mutateAsync(values);
      setIsEditing(false);
      toast.success('Your profile has been updated successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update your profile. Please try again.'));
    }
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <section aria-labelledby="profile-title" className="space-y-6">
      <PageHeader />

      <div className="max-w-3xl rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <ProfileHeader
          name={profile.name}
          email={profile.email}
          avatarUrl={profile.avatarUrl}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
        />

        <ProfileForm
          profile={profile}
          isEditing={isEditing}
          isSubmitting={updateProfileMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <div className="mt-8">
          <ChangePasswordCard />
        </div>
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 id="profile-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Profile Overview
      </h1>

      <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
        Manage your personal information and account preferences.
      </p>
    </div>
  );
}
