import { Home, Compass, GraduationCap, Award, type LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  authOnly?: boolean;
}

export const navItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: Compass,
  },
  {
    label: 'My Learning',
    href: '/learning',
    icon: GraduationCap,
    authOnly: true,
  },
  {
    label: 'Certificates',
    href: '/learning#certificates',
    icon: Award,
    authOnly: true,
  },
];
