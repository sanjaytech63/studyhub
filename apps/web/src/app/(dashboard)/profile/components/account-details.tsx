import { CalendarDays, CheckCircle2, Mail, ShieldCheck, User } from 'lucide-react';

import type { Profile } from '@/lib/profile/profile.types';

interface AccountDetailsProps {
  readonly profile: Profile;
}

export function AccountDetails({ profile }: AccountDetailsProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/70 px-6 py-5">
        <h2 className="text-base font-semibold">Account information</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your current account and verification details.
        </p>
      </div>

      <div className="grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <InfoItem
          icon={User}
          label="Full name"
          value={[profile.firstName, profile.lastName].filter(Boolean).join(' ')}
        />

        <InfoItem
          icon={Mail}
          label="Email address"
          value={profile.email}
          suffix={
            profile.emailVerifiedAt ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Not verified
              </span>
            )
          }
        />

        <InfoItem icon={ShieldCheck} label="Role" value={profile.role.name} />

        <InfoItem icon={CalendarDays} label="Member since" value={formatDate(profile.createdAt)} />
      </div>
    </section>
  );
}

interface InfoItemProps {
  readonly icon: React.ComponentType<{
    className?: string;
  }>;
  readonly label: string;
  readonly value: string;
  readonly suffix?: React.ReactNode;
}

function InfoItem({ icon: Icon, label, value, suffix }: InfoItemProps) {
  return (
    <div className="flex gap-3 p-6">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{value}</p>

          {suffix}
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
