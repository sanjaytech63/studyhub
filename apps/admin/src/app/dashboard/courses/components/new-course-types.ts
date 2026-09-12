import type React from 'react';
import { BookOpen, CheckCircle2, DollarSign, Layers } from 'lucide-react';

export interface LessonDraft {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE';
  durationMinutes: number;
  videoUrl?: string;
  content?: string;
  isFreePreview: boolean;
}

export interface ModuleDraft {
  id: string;
  title: string;
  description: string;
  lessons: LessonDraft[];
}

export type CourseTab = 'info' | 'pricing' | 'curriculum' | 'review';

export interface CourseTabItem {
  id: CourseTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const COURSE_TABS: CourseTabItem[] = [
  {
    id: 'info',
    label: 'Course Details',
    icon: BookOpen,
  },
  {
    id: 'pricing',
    label: 'Pricing & Media',
    icon: DollarSign,
  },
  {
    id: 'curriculum',
    label: 'Curriculum & Previews',
    icon: Layers,
  },
  {
    id: 'review',
    label: 'Review & Launch',
    icon: CheckCircle2,
  },
];

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
