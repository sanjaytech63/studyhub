import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  Palette,
  Smartphone,
} from 'lucide-react';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
  icon: LucideIcon;
}

export const courseCategories: CourseCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Build modern websites and production applications.',
    courseCount: 120,
    icon: Code2,
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Explore LLMs, neural networks, and generative AI.',
    courseCount: 95,
    icon: BrainCircuit,
  },
  {
    id: 'data-science',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Work with data, analytics, and machine learning.',
    courseCount: 86,
    icon: Database,
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Design thoughtful digital products and experiences.',
    courseCount: 64,
    icon: Palette,
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Create scalable applications for mobile platforms.',
    courseCount: 52,
    icon: Smartphone,
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud',
    slug: 'devops-cloud',
    description: 'Deploy, operate, and scale modern infrastructure.',
    courseCount: 48,
    icon: Cloud,
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Develop practical skills for modern business.',
    courseCount: 72,
    icon: BriefcaseBusiness,
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Turn business data into useful decisions.',
    courseCount: 41,
    icon: BarChart3,
  },
];
