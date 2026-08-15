import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  readonly name: string;
  readonly avatarUrl?: string;
}

export function ProfileAvatar({ name, avatarUrl }: ProfileAvatarProps) {
  return (
    <Avatar className="size-16 border border-border sm:size-20">
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={`${name}'s profile`} /> : null}

      <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary sm:text-lg">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
