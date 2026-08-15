export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  courses: () => [...dashboardKeys.all, 'courses'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
};
