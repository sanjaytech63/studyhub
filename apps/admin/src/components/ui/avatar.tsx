import * as React from 'react';
import { cn } from './button';

export interface AvatarProps {
  readonly firstName?: string;
  readonly lastName?: string | null;
  readonly email?: string;
  readonly avatarUrl?: string | null;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly isOnline?: boolean;
  readonly className?: string;
}

export function Avatar({
  firstName = '',
  lastName = '',
  email = '',
  avatarUrl,
  size = 'md',
  isOnline,
  className,
}: AvatarProps) {
  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return 'U';
  };

  // Deterministic color based on initials/name
  const colors = [
    'from-indigo-600 to-violet-700 text-indigo-100',
    'from-emerald-600 to-teal-700 text-emerald-100',
    'from-blue-600 to-cyan-700 text-blue-100',
    'from-purple-600 to-pink-700 text-purple-100',
    'from-amber-600 to-orange-700 text-amber-100',
  ];
  const charCode = (firstName.charCodeAt(0) || email.charCodeAt(0) || 0) % colors.length;
  const gradientColor = colors[charCode];

  const sizeClasses = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  }[size];

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center',
        className,
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={firstName ? `${firstName} ${lastName || ''}`.trim() : email || 'Avatar'}
          className={cn(
            'rounded-full object-cover shadow-inner border border-border/40',
            sizeClasses,
          )}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full font-semibold font-mono tracking-wider shadow-inner bg-gradient-to-tr border border-white/15',
            sizeClasses,
            gradientColor,
          )}
        >
          {getInitials()}
        </div>
      )}

      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background',
            isOnline ? 'bg-emerald-500' : 'bg-slate-500',
          )}
        />
      )}
    </div>
  );
}
