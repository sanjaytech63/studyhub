import type { LucideIcon } from 'lucide-react';

export interface DashboardUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
}

export interface DashboardStats {
  readonly courses: number;
  readonly learningHours: number;
  readonly projects: number;
  readonly achievements: number;
}

export interface CourseProgress {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly progress: number;
  readonly imageUrl?: string;
  readonly lastAccessedAt?: string;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface NavigationSection {
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface DashboardMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

export interface LearningCourse {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly progress: number;
  readonly imageUrl?: string;
  readonly lastAccessedAt?: string;
}

export interface DashboardData {
  readonly metrics: readonly DashboardMetric[];
  readonly continueLearning: readonly LearningCourse[];
}
