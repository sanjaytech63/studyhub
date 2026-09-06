export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  update: () => [...profileKeys.all, 'update'] as const,
  changePassword: () => [...profileKeys.all, 'change-password'] as const,
  sessions: () => [...profileKeys.all, 'sessions'] as const,
  changeEmail: () => [...profileKeys.all, 'change-email'] as const,
};
