'use client';

import { BookOpenCheck, GraduationCap, Target } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from './settings-section';
import { SettingsRow } from './settings-row';

const STORAGE_KEY = 'studyhub-learning-settings';

interface LearningPreferences {
  readonly continueLearning: boolean;
  readonly progressReminders: boolean;
  readonly completionCelebrations: boolean;
}

const DEFAULT_PREFERENCES: LearningPreferences = {
  continueLearning: true,
  progressReminders: true,
  completionCelebrations: true,
};

function readPreferences(): LearningPreferences {
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

    const data = parsed as Partial<LearningPreferences>;

    return {
      continueLearning:
        typeof data.continueLearning === 'boolean'
          ? data.continueLearning
          : DEFAULT_PREFERENCES.continueLearning,

      progressReminders:
        typeof data.progressReminders === 'boolean'
          ? data.progressReminders
          : DEFAULT_PREFERENCES.progressReminders,

      completionCelebrations:
        typeof data.completionCelebrations === 'boolean'
          ? data.completionCelebrations
          : DEFAULT_PREFERENCES.completionCelebrations,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function LearningSettings() {
  const [preferences, setPreferences] = useState<LearningPreferences>(readPreferences);

  function updatePreference(key: keyof LearningPreferences, value: boolean) {
    setPreferences((current) => {
      const next: LearningPreferences = {
        ...current,
        [key]: value,
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore localStorage failures.
      }

      return next;
    });
  }

  return (
    <SettingsSection
      title="Learning"
      description="Customize your learning experience and progress tracking."
    >
      <SettingsRow
        icon={<BookOpenCheck className="size-5" />}
        title="Continue where you left off"
        description="Automatically resume your most recently opened lesson."
      >
        <Switch
          checked={preferences.continueLearning}
          onCheckedChange={(value) => updatePreference('continueLearning', value)}
          aria-label="Toggle continue learning"
        />
      </SettingsRow>

      <SettingsRow
        icon={<Target className="size-5" />}
        title="Progress reminders"
        description="Get reminders when you have an unfinished learning goal."
      >
        <Switch
          checked={preferences.progressReminders}
          onCheckedChange={(value) => updatePreference('progressReminders', value)}
          aria-label="Toggle progress reminders"
        />
      </SettingsRow>

      <SettingsRow
        icon={<GraduationCap className="size-5" />}
        title="Completion celebrations"
        description="Show a celebration when you complete a course or major milestone."
        last
      >
        <Switch
          checked={preferences.completionCelebrations}
          onCheckedChange={(value) => updatePreference('completionCelebrations', value)}
          aria-label="Toggle completion celebrations"
        />
      </SettingsRow>
    </SettingsSection>
  );
}
