'use client';

import { KeyRound, Laptop, ShieldCheck, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChangePasswordDialog } from './change-password-dialog';
import { sessionsQueryOptions } from '@/lib/profile/profile.queries';
import {
  useRevokeOtherSessionsMutation,
  useRevokeSessionMutation,
} from '@/lib/profile/profile.mutations';
import { getSessionId } from '@/lib/api/api-client';
import { getApiErrorMessage } from '@/lib/api/api-error';

export function SecurityCard() {
  const currentSessionId = getSessionId();
  const sessionsQuery = useQuery(sessionsQueryOptions);
  const revokeSessionMutation = useRevokeSessionMutation();
  const revokeOtherMutation = useRevokeOtherSessionsMutation();

  const sessions = sessionsQuery.data ?? [];
  const otherSessionsCount = sessions.filter((s) => s.id !== currentSessionId).length;

  async function handleRevokeSession(sessionId: string) {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      toast.success('Session revoked successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to revoke session.'));
    }
  }

  async function handleRevokeOtherSessions() {
    try {
      await revokeOtherMutation.mutateAsync();
      toast.success('All other sessions have been revoked.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to revoke other sessions.'));
    }
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-sm divide-y divide-border/70">
      {/* Password section */}
      <div>
        <div className="border-b border-border/70 px-6 py-5">
          <h2 className="text-base font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your account protected with a strong password.
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">Password</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Change your password regularly to keep your account secure.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <KeyRound className="size-3.5" />
                Password protected
              </div>
            </div>
          </div>

          <ChangePasswordDialog />
        </div>
      </div>

      {/* Active Sessions section */}
      <div>
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Active Sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Devices and browsers currently logged into your StudyHub account.
            </p>
          </div>

          {otherSessionsCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={revokeOtherMutation.isPending}
              onClick={handleRevokeOtherSessions}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {revokeOtherMutation.isPending ? 'Signing out...' : 'Sign out other sessions'}
            </Button>
          )}
        </div>

        <div className="p-6 pt-2">
          {sessionsQuery.isPending ? (
            <p className="text-xs text-muted-foreground">Loading active sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-muted/20">
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Laptop className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-semibold">
                            {session.userAgent || 'Unknown Device'}
                          </p>
                          {isCurrent && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase font-bold text-primary"
                            >
                              This Device
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {session.ipAddress ? `IP: ${session.ipAddress} • ` : ''}
                          Last active: {new Date(session.lastActiveAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={revokeSessionMutation.isPending}
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive self-end sm:self-center"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
