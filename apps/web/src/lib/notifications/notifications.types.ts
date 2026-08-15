export type NotificationType = 'course' | 'achievement' | 'system' | 'security' | 'account';

export interface NotificationItem {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly createdAt: string;
  readonly href?: string;
  readonly isRead: boolean;
}
