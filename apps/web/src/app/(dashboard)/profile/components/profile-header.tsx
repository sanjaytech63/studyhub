import { Button } from '@/components/ui/button';

import { ProfileAvatar } from './profile-avatar';

interface ProfileHeaderProps {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
  readonly isEditing: boolean;
  readonly onEdit: () => void;
}

export function ProfileHeader({ name, email, avatarUrl, isEditing, onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <ProfileAvatar name={name} avatarUrl={avatarUrl} />

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold sm:text-lg">{name}</h2>

          <p className="mt-0.5 truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onEdit}
        disabled={isEditing}
        className="w-full sm:w-auto"
      >
        Edit Profile
      </Button>
    </div>
  );
}
