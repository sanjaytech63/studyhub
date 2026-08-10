import { BookOpen, FileText, Home, type LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Course',
    href: '/courses',
    icon: BookOpen,
  },
  {
    label: 'Feature',
    href: '/features',
    icon: FileText,
  },
  {
    label: 'Pricing',
    href: '/pricing',
    icon: FileText,
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: FileText,
  },
];
