'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronUp, LogOut, Settings, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/lib/auth/auth.mutations';

export function DashboardUserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  /*
   * Close menu when clicking outside.
   */
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;

      if (
        containerRef.current &&
        target instanceof Node &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  /*
   * Close dropdown with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  /*
   * User can temporarily be null while auth
   * state is being restored.
   */
  if (!user) {
    return null;
  }

  async function handleLogout() {
    if (logoutMutation.isPending) {
      return;
    }

    setOpen(false);

    try {
      await logoutMutation.mutateAsync();
      toast.success('You have been logged out.');
      router.replace('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to complete logout.');
      router.replace('/login');
    }
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  const initials = getInitials(fullName || user.email);

  return (
    <div ref={containerRef} className="relative">
      {/* =====================================================
          USER TRIGGER
          ===================================================== */}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        onClick={() => setOpen((current) => !current)}
        className={[
          'flex w-full items-center gap-3 rounded-xl p-2',
          'text-left',
          'transition-colors duration-200',
          'hover:bg-muted/70',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary/40',
        ].join(' ')}
      >
        {/* Avatar */}

        <div
          aria-hidden="true"
          className={[
            'flex size-9 shrink-0 items-center',
            'justify-center rounded-xl',
            'bg-primary',
            'text-xs font-semibold',
            'text-primary-foreground',
            'shadow-sm',
          ].join(' ')}
        >
          {initials}
        </div>

        {/* User information */}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{fullName || 'User'}</p>

          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        {/* Chevron */}

        <ChevronUp
          aria-hidden="true"
          className={[
            'size-4 shrink-0',
            'text-muted-foreground',
            'transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* =====================================================
          DROPDOWN
          ===================================================== */}

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className={[
            'absolute bottom-full left-0 mb-2',
            'w-full min-w-64',
            'overflow-hidden',
            'rounded-xl',
            'border border-border/70',
            'bg-background/95',
            'p-1.5',
            'shadow-xl shadow-black/10',
            'backdrop-blur-xl',
          ].join(' ')}
        >
          {/* User information */}

          <div className="border-b border-border/70 px-3 py-3">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className={[
                  'flex size-10 shrink-0',
                  'items-center justify-center',
                  'rounded-xl',
                  'bg-primary',
                  'text-sm font-semibold',
                  'text-primary-foreground',
                ].join(' ')}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{fullName || 'User'}</p>

                <p className="truncate text-xs text-muted-foreground">{user.email}</p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[11px] font-medium text-muted-foreground">
                    Active account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account information */}

          <div className="border-b border-border/70 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Role</span>

              <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wide">
                Student
              </span>
            </div>
          </div>

          {/* Navigation */}

          <div className="py-1">
            <MenuLink
              href="/profile"
              icon={<UserRound className="size-4" />}
              label="Profile"
              onClick={() => setOpen(false)}
            />

            <MenuLink
              href="/settings"
              icon={<Settings className="size-4" />}
              label="Settings"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Logout */}

          <div className="border-t border-border/70 pt-1">
            <button
              type="button"
              role="menuitem"
              disabled={logoutMutation.isPending}
              onClick={() => {
                void handleLogout();
              }}
              className={[
                'flex h-9 w-full items-center gap-2',
                'rounded-lg px-3',
                'text-sm',
                'text-destructive',
                'transition-colors',
                'hover:bg-destructive/10',
                'disabled:pointer-events-none',
                'disabled:opacity-50',
              ].join(' ')}
            >
              <LogOut className="size-4" />

              <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MENU LINK
   ============================================================ */

interface MenuLinkProps {
  readonly href: string;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly onClick: () => void;
}

function MenuLink({ href, icon, label, onClick }: MenuLinkProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={[
        'flex h-9 items-center gap-2',
        'rounded-lg px-3',
        'text-sm text-muted-foreground',
        'transition-colors duration-150',
        'hover:bg-muted',
        'hover:text-foreground',
      ].join(' ')}
    >
      {icon}

      <span>{label}</span>
    </Link>
  );
}

/* ============================================================
   INITIALS
   ============================================================ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
