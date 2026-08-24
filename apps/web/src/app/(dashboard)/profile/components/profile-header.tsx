import { CheckCircle2, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Profile } from '@/lib/profile/profile.types';

interface ProfileHeaderProps {
  readonly profile: Profile;
  readonly isEditing: boolean;
  readonly onEdit: () => void;
}

export function ProfileHeader({ profile, isEditing, onEdit }: ProfileHeaderProps) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  const initials =
    `${profile.firstName.charAt(0)}${profile.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const isVerified = Boolean(profile.emailVerifiedAt);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="relative">
        <div className="h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6">
          <div className="-mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              <div
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary/15 text-xl font-semibold text-primary shadow-sm"
              >
                {initials}
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
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={isEditing}
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
