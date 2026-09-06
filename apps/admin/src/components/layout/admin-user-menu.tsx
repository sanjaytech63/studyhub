'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  LogOut,
  Users,
  ShieldAlert,
  KeyRound,
  ExternalLink,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { logout } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';

export function AdminUserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { user, logout: storeLogout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    try {
      const res = await logout();
      toast.success(res?.message || 'Signed out successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Session ended.'));
    } finally {
      storeLogout();
      router.push('/login');
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Admin account menu"
        className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/60 p-1.5 pl-2 transition-all duration-200 hover:bg-secondary hover:border-border hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Avatar
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          avatarUrl={user.avatarUrl}
          size="sm"
          isOnline={true}
        />

        <div className="hidden text-left md:block min-w-0 pr-1">
          <p className="truncate text-xs font-semibold text-foreground leading-tight">
            {fullName || 'Administrator'}
          </p>
          <p className="truncate text-[10px] text-muted-foreground font-mono">
            {user.role?.name || 'ADMIN'}
          </p>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Admin account dropdown"
          className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-fade-up"
        >
          {/* User Profile Card */}
          <div className="border-b border-border/60 p-3 bg-secondary/30 rounded-xl mb-1">
            <div className="flex items-center gap-3">
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                avatarUrl={user.avatarUrl}
                size="md"
                isOnline={true}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-foreground">
                  {fullName || 'Administrator'}
                </p>
                <p className="truncate text-[11px] text-muted-foreground font-mono">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="system" size="sm">
                    {user.role?.name || 'ADMIN'}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5 py-1">
            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4 text-primary" />
              <span>Profile & Security</span>
            </Link>

            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-400" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/dashboard/users"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4 text-blue-400" />
              <span>Users Directory</span>
            </Link>

            <Link
              href="/dashboard/roles"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <ShieldAlert className="h-4 w-4 text-purple-400" />
              <span>Roles & RBAC</span>
            </Link>

            <Link
              href="/dashboard/permissions"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <KeyRound className="h-4 w-4 text-amber-400" />
              <span>Permissions Matrix</span>
            </Link>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-emerald-400" />
                <span>Go to Student App</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60">3000</span>
            </a>
          </div>

          {/* Logout Button */}
          <div className="border-t border-border/60 pt-1 mt-1">
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
