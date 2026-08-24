export type NotificationType = 'course' | 'learning' | 'achievement' | 'system' | 'announcement';

export interface NotificationItem {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly isRead: boolean;
  readonly createdAt: string;
  readonly href?: string;
  readonly metadata?: {
    readonly courseName?: string;
    readonly lessonName?: string;
    readonly achievementName?: string;
  };
}
