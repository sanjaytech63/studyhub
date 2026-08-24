'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@teispace/next-themes';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from './settings-section';

export function AppearanceSettings() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isSystem = theme === 'system';
  const isDark = theme === 'dark' || (isSystem && resolvedTheme === 'dark');

  function handleDarkModeChange(checked: boolean) {
    setTheme(checked ? 'dark' : 'light');
  }

  function handleSystemPreferenceChange(checked: boolean) {
    if (checked) {
      setTheme('system');
      return;
    }

    setTheme(resolvedTheme === 'dark' ? 'dark' : 'light');
  }

  return (
    <SettingsSection title="Appearance" description="Customize how StudyHub looks on your device.">
      <div className="divide-y divide-border/60">
        {/* Dark Mode */}
        <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
          <div
            className={[
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              isDark ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Dark mode</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Use a darker appearance thats easier on the eyes.
            </p>
          </div>

          <Switch
            checked={isDark && !isSystem}
            disabled={isSystem}
            onCheckedChange={handleDarkModeChange}
            aria-label="Toggle dark mode"
          />
        </div>

        {/* System Preference */}
        <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
          <div
            className={[
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              isSystem ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            <Monitor className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">System preference</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Follow your devices light or dark mode automatically.
            </p>
          </div>

          <Switch
            checked={isSystem}
            onCheckedChange={handleSystemPreferenceChange}
            aria-label="Use system theme preference"
          />
        </div>
      </div>
    </SettingsSection>
  );
}
