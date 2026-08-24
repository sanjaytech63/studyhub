import { Settings } from 'lucide-react';
import { AccountSettings } from './components/account-settings';
import { AppearanceSettings } from './components/appearance-settings';
import { DangerZone } from './components/danger-zone';
import { LearningSettings } from './components/learning-settings';
import { NotificationSettings } from './components/notification-settings';

export default function SettingsPage() {
  return (
    <section aria-labelledby="settings-title" className="space-y-8">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
          <Settings className="size-5" />
        </div>

        <div>
          <h1 id="settings-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your account, appearance, notifications, and learning preferences.
          </p>
        </div>
      </div>

      {/* Settings content */}
      <div className="max-w-4xl space-y-6">
        <AccountSettings />
        <AppearanceSettings />
        <NotificationSettings />
        <LearningSettings />
        <DangerZone />
      </div>
    </section>
  );
}
