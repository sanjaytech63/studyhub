import { Award, Bell, BookOpen, GraduationCap, Megaphone, type LucideIcon } from 'lucide-react';

import type { NotificationType } from './notifications.types';

interface NotificationTypeConfig {
  readonly label: string;
  readonly icon: LucideIcon;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  course: {
    label: 'Courses',
    icon: BookOpen,
  },

  learning: {
    label: 'Learning',
    icon: GraduationCap,
  },

  achievement: {
    label: 'Achievements',
    icon: Award,
  },

  system: {
    label: 'System',
    icon: Bell,
  },

  announcement: {
    label: 'Announcements',
    icon: Megaphone,
  },
};
