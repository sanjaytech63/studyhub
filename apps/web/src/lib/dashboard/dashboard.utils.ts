import type { BreadcrumbItem } from './dashboard.types';

const DASHBOARD_ROOT = '/dashboard';

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }

  return path;
}

export function isActiveRoute(pathname: string, href: string): boolean {
  const currentPath = normalizePath(pathname);
  const targetPath = normalizePath(href);

  if (targetPath === DASHBOARD_ROOT) {
    return currentPath === DASHBOARD_ROOT;
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function formatSegment(segment: string): string {
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function createBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === '/' || normalizedPath === DASHBOARD_ROOT) {
    return [
      {
        label: 'Dashboard',
      },
    ];
  }

  const segments = normalizedPath.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      href: DASHBOARD_ROOT,
    },
  ];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    if (currentPath === DASHBOARD_ROOT) {
      return;
    }

    breadcrumbs.push({
      label: formatSegment(segment),
      href: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
