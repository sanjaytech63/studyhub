import { BadgeCheck, ChevronRight, KeyRound, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { SettingsSection } from './settings-section';
import { SettingsRow } from './settings-row';

export function AccountSettings() {
  return (
    <SettingsSection
      title="Account"
      description="Manage your personal information and account security."
    >
      <SettingsRow
        icon={<UserRound className="size-5" />}
        title="Profile information"
        description="Update your name and review your account information."
      >
        <Button variant="outline" size="sm" className="w-full">
          <Link href="/profile" className="flex items-center gap-2">
            Manage profile
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </SettingsRow>

      <SettingsRow
        icon={<KeyRound className="size-5" />}
        title="Password"
        description="Keep your account secure with a strong password."
      >
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href="/profile" className="flex items-center gap-2">
            Change password
            <ChevronRight className="ml-1 size-4" />
          </Link>
        </Button>
      </SettingsRow>

      <SettingsRow
        icon={<BadgeCheck className="size-5" />}
        title="Account verification"
        description="Your email address is used to secure your account."
        last
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <span className="size-1.5 rounded-full bg-current" />
          Verified
        </Badge>
      </SettingsRow>
    </SettingsSection>
  );
}
