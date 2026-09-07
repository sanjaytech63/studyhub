'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Camera, CheckCircle2, Loader, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { Profile } from '@/lib/profile/profile.types';
import { useDeleteAvatarMutation, useUploadAvatarMutation } from '@/lib/profile/profile.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

interface ProfileHeaderProps {
  readonly profile: Profile;
  readonly isEditing: boolean;
  readonly onEdit: () => void;
}

export function ProfileHeader({ profile, isEditing, onEdit }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatarMutation();
  const deleteAvatarMutation = useDeleteAvatarMutation();

  const isUploading = uploadAvatarMutation.isPending;
  const isDeleting = deleteAvatarMutation.isPending;
  const isProcessing = isUploading || isDeleting;

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  const initials =
    `${profile.firstName.charAt(0)}${profile.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const isVerified = Boolean(profile.emailVerifiedAt);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be re-selected if needed
    event.target.value = '';

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      const res = await uploadAvatarMutation.mutateAsync(file);
      toast.success(res?.message || 'Profile picture updated successfully!');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to upload profile picture.'));
    }
  }

  async function handleDeleteAvatar() {
    if (!profile.avatarUrl) return;

    try {
      const res = await deleteAvatarMutation.mutateAsync();
      toast.success(res?.message || 'Profile picture removed.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to remove profile picture.'));
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="relative">
        <div className="h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              {/* Avatar with upload overlay */}
              <div className="group relative shrink-0">
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-primary/15 text-xl font-semibold text-primary shadow-md">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={fullName || 'Profile'}
                      width={80}
                      height={80}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-xs">
                      <Loader className="size-6 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload overlay button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile picture"
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:pointer-events-none text-white focus-visible:opacity-100 focus-visible:outline-none"
                >
                  <Camera className="size-5" />
                  <span className="mt-1 text-[10px] font-medium tracking-wide">Change</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold">{fullName}</h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-current" />
                    Active
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-muted-foreground">{profile.email}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-muted px-2 py-1 font-medium">
                    {profile.role.name}
                  </span>

                  {isVerified && (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      Email verified
                    </span>
                  )}

                  {profile.avatarUrl && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDeleteAvatar}
                      className="inline-flex items-center gap-1 text-destructive/80 hover:text-destructive hover:underline transition-colors ml-1 font-medium"
                    >
                      <Trash2 className="size-3" />
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={isEditing || isProcessing}
              className="shrink-0"
            >
              <Pencil className="mr-2 size-4" />
              Edit profile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
