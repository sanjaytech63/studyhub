'use client';

import { Bell, BookOpen, Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { Switch } from '@/components/ui/switch';

import { SettingsSection } from './settings-section';
import { SettingsRow } from './settings-row';

const STORAGE_KEY = 'studyhub-notification-settings';

interface NotificationPreferences {
  readonly email: boolean;
  readonly courseUpdates: boolean;
  readonly learningReminders: boolean;
  readonly announcements: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  courseUpdates: true,
  learningReminders: true,
  announcements: true,
};

function readPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_PREFERENCES;
    }

    const data = parsed as Partial<NotificationPreferences>;

    return {
      email: typeof data.email === 'boolean' ? data.email : DEFAULT_PREFERENCES.email,

      courseUpdates:
        typeof data.courseUpdates === 'boolean'
          ? data.courseUpdates
          : DEFAULT_PREFERENCES.courseUpdates,

      learningReminders:
        typeof data.learningReminders === 'boolean'
          ? data.learningReminders
          : DEFAULT_PREFERENCES.learningReminders,

      announcements:
        typeof data.announcements === 'boolean'
          ? data.announcements
          : DEFAULT_PREFERENCES.announcements,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(readPreferences);

  function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    setPreferences((current) => {
      const next: NotificationPreferences = {
        ...current,
        [key]: value,
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage can fail in private/restricted environments.
      }

      return next;
    });
  }

  return (
    <SettingsSection
      title="Notifications"
      description="Choose which updates and reminders you want to receive."
    >
      <SettingsRow
        icon={<Mail className="size-5" />}
        title="Email notifications"
        description="Receive important account and platform updates by email."
      >
        <Switch
          checked={preferences.email}
          onCheckedChange={(value) => updatePreference('email', value)}
          aria-label="Toggle email notifications"
        />
      </SettingsRow>

      <SettingsRow
        icon={<BookOpen className="size-5" />}
        title="Course updates"
        description="Get notified when your enrolled courses are updated."
      >
        <Switch
          checked={preferences.courseUpdates}
          onCheckedChange={(value) => updatePreference('courseUpdates', value)}
          aria-label="Toggle course updates"
        />
      </SettingsRow>

      <SettingsRow
        icon={<Bell className="size-5" />}
        title="Learning reminders"
        description="Receive reminders to stay consistent with your learning goals."
      >
        <Switch
          checked={preferences.learningReminders}
          onCheckedChange={(value) => updatePreference('learningReminders', value)}
          aria-label="Toggle learning reminders"
        />
      </SettingsRow>

      <SettingsRow
        icon={<MessageSquare className="size-5" />}
        title="Announcements"
        description="Receive important StudyHub announcements and product updates."
        last
      >
        <Switch
          checked={preferences.announcements}
          onCheckedChange={(value) => updatePreference('announcements', value)}
          aria-label="Toggle announcements"
        />
      </SettingsRow>
    </SettingsSection>
  );
}
