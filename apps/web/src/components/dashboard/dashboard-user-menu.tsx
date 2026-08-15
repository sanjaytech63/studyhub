'use client';

import Link from 'next/link';
import { ChevronUp, LogOut, Settings, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { temporaryDashboardUser } from '@/lib/dashboard/dashboard.constants';

export function DashboardUserMenu() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const user = temporaryDashboardUser;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={[
          'flex w-full items-center gap-3 rounded-lg p-2',
          'text-left',
          'transition-colors',
          'hover:bg-muted',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary/40',
        ].join(' ')}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          {getInitials(user.name)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user.name}</p>

          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <ChevronUp
          className={[
            'size-4 shrink-0 text-muted-foreground',
            'transition-transform duration-150',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={[
            'absolute bottom-full left-0 mb-2 w-full min-w-56',
            'rounded-xl border border-border/70',
            'bg-background p-1.5 shadow-lg',
          ].join(' ')}
        >
          <div className="border-b border-border/70 px-3 py-2.5">
            <p className="truncate text-sm font-semibold">{user.name}</p>

            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

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

          <div className="border-t border-border/70 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);

                // Connect real authentication logout here.
              }}
              className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />

              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}

      <span>{label}</span>
    </Link>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
