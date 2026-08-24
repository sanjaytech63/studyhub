import { KeyRound, ShieldCheck } from 'lucide-react';

import { ChangePasswordDialog } from './change-password-dialog';

export function SecurityCard() {
  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-sm">
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
    </section>
  );
}
