import type { Course, CourseFilters } from '@/lib/courses/course-types';

/* ==========================================================================
   CATEGORIES
========================================================================== */

export const CATEGORIES = [
  {
    label: 'All Categories',
    value: 'all',
  },
  {
    label: 'Web Development',
    value: 'development',
  },
  {
    label: 'UI/UX Design',
    value: 'design',
  },
  {
    label: 'Data Science & AI',
    value: 'data-science',
  },
  {
    label: 'Business & Leadership',
    value: 'business',
  },
  {
    label: 'Cloud & DevOps',
    value: 'devops',
  },
] as const;

/* ==========================================================================
   COURSES
========================================================================== */

export const COURSES_MOCK: readonly Course[] = [
  {
    id: 'c1',
    slug: 'react-nextjs-masterclass',
    title: 'React 19 & Next.js App Router Masterclass',
    description:
      'Build enterprise-grade, production-ready fullstack web applications using server actions, streaming, and modern patterns.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i1',
      name: 'Arjun Mehta',
      title: 'Principal Engineer at TechCorp',
      avatarUrl: 'https://i.pravatar.cc/160?img=12',
    },

    rating: 4.9,
    reviewCount: 1420,
    durationHours: 24,
    lessonCount: 56,

    price: 1999,
    originalPrice: 3999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-15',
  },

  {
    id: 'c2',
    slug: 'system-design-for-scale',
    title: 'System Design & Distributed Systems Architecture',
    description:
      'Master high-availability architecture, microservices, messaging queues, and database sharding for large-scale platforms.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i2',
      name: 'Priya Sharma',
      title: 'Ex-Staff Architect at CloudNative',
      avatarUrl: 'https://i.pravatar.cc/160?img=47',
    },

    rating: 4.8,
    reviewCount: 890,
    durationHours: 18,
    lessonCount: 42,

    price: 2499,
    originalPrice: 4999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-07-20',
  },

  {
    id: 'c3',
    slug: 'ui-ux-design-systems-figma',
    title: 'Enterprise Design Systems in Figma & React',
    description:
      'Architect scalable tokens, accessible component libraries, and visual specifications bridging product design and frontend.',
    category: 'design',
    level: 'intermediate',

    instructor: {
      id: 'i3',
      name: 'Rohan Verma',
      title: 'Design Director at Studio UX',
      avatarUrl: 'https://i.pravatar.cc/160?img=11',
    },

    rating: 4.7,
    reviewCount: 630,
    durationHours: 12,
    lessonCount: 30,

    price: 1499,
    originalPrice: 2999,

    isFeatured: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-01',
  },

  {
    id: 'c4',
    slug: 'python-data-science-machine-learning',
    title: 'Practical Machine Learning & Predictive Modeling',
    description:
      'Train, evaluate, and deploy production ML models using Python, Scikit-Learn, PyTorch, and cloud inference pipelines.',
    category: 'data-science',
    level: 'beginner',

    instructor: {
      id: 'i4',
      name: 'Dr. Ananya Roy',
      title: 'Lead AI Researcher',
      avatarUrl: 'https://i.pravatar.cc/160?img=32',
    },

    rating: 4.6,
    reviewCount: 1100,
    durationHours: 32,
    lessonCount: 78,

    price: 0,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-06-10',
  },

  {
    id: 'c5',
    slug: 'product-management-fundamentals',
    title: 'Product Strategy, Analytics & Growth Management',
    description:
      'Learn how modern PMs frame problems, run effective discovery cycles, prioritize roadmaps, and track north-star metrics.',
    category: 'business',
    level: 'beginner',

    instructor: {
      id: 'i5',
      name: 'Karan Iyer',
      title: 'VP of Product at ScaleUp',
      avatarUrl: 'https://i.pravatar.cc/160?img=68',
    },

    rating: 4.8,
    reviewCount: 450,
    durationHours: 8,
    lessonCount: 22,

    price: 1299,
    originalPrice: 2499,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-10',
  },

  {
    id: 'c6',
    slug: 'docker-kubernetes-devops-pipeline',
    title: 'Cloud-Native DevOps: Docker, K8s & Terraform',
    description:
      'Automate modern infrastructure, configure resilient CI/CD pipelines, and orchestrate containerized cloud applications.',
    category: 'devops',
    level: 'intermediate',

    instructor: {
      id: 'i6',
      name: 'Suresh Kumar',
      title: 'Senior DevOps Architect',
      avatarUrl: 'https://i.pravatar.cc/160?img=51',
    },

    rating: 4.9,
    reviewCount: 780,
    durationHours: 20,
    lessonCount: 48,

    price: 1799,
    originalPrice: 3499,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    updatedAt: '2026-07-28',
  },
  {
    id: 'c1',
    slug: 'react-nextjs-masterclass',
    title: 'React 19 & Next.js App Router Masterclass',
    description:
      'Build enterprise-grade, production-ready fullstack web applications using server actions, streaming, and modern patterns.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i1',
      name: 'Arjun Mehta',
      title: 'Principal Engineer at TechCorp',
      avatarUrl: 'https://i.pravatar.cc/160?img=12',
    },

    rating: 4.9,
    reviewCount: 1420,
    durationHours: 24,
    lessonCount: 56,

    price: 1999,
    originalPrice: 3999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-15',
  },

  {
    id: 'c2',
    slug: 'system-design-for-scale',
    title: 'System Design & Distributed Systems Architecture',
    description:
      'Master high-availability architecture, microservices, messaging queues, and database sharding for large-scale platforms.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i2',
      name: 'Priya Sharma',
      title: 'Ex-Staff Architect at CloudNative',
      avatarUrl: 'https://i.pravatar.cc/160?img=47',
    },

    rating: 4.8,
    reviewCount: 890,
    durationHours: 18,
    lessonCount: 42,

    price: 2499,
    originalPrice: 4999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-07-20',
  },

  {
    id: 'c3',
    slug: 'ui-ux-design-systems-figma',
    title: 'Enterprise Design Systems in Figma & React',
    description:
      'Architect scalable tokens, accessible component libraries, and visual specifications bridging product design and frontend.',
    category: 'design',
    level: 'intermediate',

    instructor: {
      id: 'i3',
      name: 'Rohan Verma',
      title: 'Design Director at Studio UX',
      avatarUrl: 'https://i.pravatar.cc/160?img=11',
    },

    rating: 4.7,
    reviewCount: 630,
    durationHours: 12,
    lessonCount: 30,

    price: 1499,
    originalPrice: 2999,

    isFeatured: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-01',
  },

  {
    id: 'c4',
    slug: 'python-data-science-machine-learning',
    title: 'Practical Machine Learning & Predictive Modeling',
    description:
      'Train, evaluate, and deploy production ML models using Python, Scikit-Learn, PyTorch, and cloud inference pipelines.',
    category: 'data-science',
    level: 'beginner',

    instructor: {
      id: 'i4',
      name: 'Dr. Ananya Roy',
      title: 'Lead AI Researcher',
      avatarUrl: 'https://i.pravatar.cc/160?img=32',
    },

    rating: 4.6,
    reviewCount: 1100,
    durationHours: 32,
    lessonCount: 78,

    price: 0,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-06-10',
  },

  {
    id: 'c5',
    slug: 'product-management-fundamentals',
    title: 'Product Strategy, Analytics & Growth Management',
    description:
      'Learn how modern PMs frame problems, run effective discovery cycles, prioritize roadmaps, and track north-star metrics.',
    category: 'business',
    level: 'beginner',

    instructor: {
      id: 'i5',
      name: 'Karan Iyer',
      title: 'VP of Product at ScaleUp',
      avatarUrl: 'https://i.pravatar.cc/160?img=68',
    },

    rating: 4.8,
    reviewCount: 450,
    durationHours: 8,
    lessonCount: 22,

    price: 1299,
    originalPrice: 2499,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-10',
  },

  {
    id: 'c6',
    slug: 'docker-kubernetes-devops-pipeline',
    title: 'Cloud-Native DevOps: Docker, K8s & Terraform',
    description:
      'Automate modern infrastructure, configure resilient CI/CD pipelines, and orchestrate containerized cloud applications.',
    category: 'devops',
    level: 'intermediate',

    instructor: {
      id: 'i6',
      name: 'Suresh Kumar',
      title: 'Senior DevOps Architect',
      avatarUrl: 'https://i.pravatar.cc/160?img=51',
    },

    rating: 4.9,
    reviewCount: 780,
    durationHours: 20,
    lessonCount: 48,

    price: 1799,
    originalPrice: 3499,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    updatedAt: '2026-07-28',
  },
  {
    id: 'c1',
    slug: 'react-nextjs-masterclass',
    title: 'React 19 & Next.js App Router Masterclass',
    description:
      'Build enterprise-grade, production-ready fullstack web applications using server actions, streaming, and modern patterns.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i1',
      name: 'Arjun Mehta',
      title: 'Principal Engineer at TechCorp',
      avatarUrl: 'https://i.pravatar.cc/160?img=12',
    },

    rating: 4.9,
    reviewCount: 1420,
    durationHours: 24,
    lessonCount: 56,

    price: 1999,
    originalPrice: 3999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-15',
  },

  {
    id: 'c2',
    slug: 'system-design-for-scale',
    title: 'System Design & Distributed Systems Architecture',
    description:
      'Master high-availability architecture, microservices, messaging queues, and database sharding for large-scale platforms.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i2',
      name: 'Priya Sharma',
      title: 'Ex-Staff Architect at CloudNative',
      avatarUrl: 'https://i.pravatar.cc/160?img=47',
    },

    rating: 4.8,
    reviewCount: 890,
    durationHours: 18,
    lessonCount: 42,

    price: 2499,
    originalPrice: 4999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-07-20',
  },

  {
    id: 'c3',
    slug: 'ui-ux-design-systems-figma',
    title: 'Enterprise Design Systems in Figma & React',
    description:
      'Architect scalable tokens, accessible component libraries, and visual specifications bridging product design and frontend.',
    category: 'design',
    level: 'intermediate',

    instructor: {
      id: 'i3',
      name: 'Rohan Verma',
      title: 'Design Director at Studio UX',
      avatarUrl: 'https://i.pravatar.cc/160?img=11',
    },

    rating: 4.7,
    reviewCount: 630,
    durationHours: 12,
    lessonCount: 30,

    price: 1499,
    originalPrice: 2999,

    isFeatured: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-01',
  },

  {
    id: 'c4',
    slug: 'python-data-science-machine-learning',
    title: 'Practical Machine Learning & Predictive Modeling',
    description:
      'Train, evaluate, and deploy production ML models using Python, Scikit-Learn, PyTorch, and cloud inference pipelines.',
    category: 'data-science',
    level: 'beginner',

    instructor: {
      id: 'i4',
      name: 'Dr. Ananya Roy',
      title: 'Lead AI Researcher',
      avatarUrl: 'https://i.pravatar.cc/160?img=32',
    },

    rating: 4.6,
    reviewCount: 1100,
    durationHours: 32,
    lessonCount: 78,

    price: 0,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-06-10',
  },

  {
    id: 'c5',
    slug: 'product-management-fundamentals',
    title: 'Product Strategy, Analytics & Growth Management',
    description:
      'Learn how modern PMs frame problems, run effective discovery cycles, prioritize roadmaps, and track north-star metrics.',
    category: 'business',
    level: 'beginner',

    instructor: {
      id: 'i5',
      name: 'Karan Iyer',
      title: 'VP of Product at ScaleUp',
      avatarUrl: 'https://i.pravatar.cc/160?img=68',
    },

    rating: 4.8,
    reviewCount: 450,
    durationHours: 8,
    lessonCount: 22,

    price: 1299,
    originalPrice: 2499,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-10',
  },

  {
    id: 'c6',
    slug: 'docker-kubernetes-devops-pipeline',
    title: 'Cloud-Native DevOps: Docker, K8s & Terraform',
    description:
      'Automate modern infrastructure, configure resilient CI/CD pipelines, and orchestrate containerized cloud applications.',
    category: 'devops',
    level: 'intermediate',

    instructor: {
      id: 'i6',
      name: 'Suresh Kumar',
      title: 'Senior DevOps Architect',
      avatarUrl: 'https://i.pravatar.cc/160?img=51',
    },

    rating: 4.9,
    reviewCount: 780,
    durationHours: 20,
    lessonCount: 48,

    price: 1799,
    originalPrice: 3499,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    updatedAt: '2026-07-28',
  },
  {
    id: 'c1',
    slug: 'react-nextjs-masterclass',
    title: 'React 19 & Next.js App Router Masterclass',
    description:
      'Build enterprise-grade, production-ready fullstack web applications using server actions, streaming, and modern patterns.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i1',
      name: 'Arjun Mehta',
      title: 'Principal Engineer at TechCorp',
      avatarUrl: 'https://i.pravatar.cc/160?img=12',
    },

    rating: 4.9,
    reviewCount: 1420,
    durationHours: 24,
    lessonCount: 56,

    price: 1999,
    originalPrice: 3999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-15',
  },

  {
    id: 'c2',
    slug: 'system-design-for-scale',
    title: 'System Design & Distributed Systems Architecture',
    description:
      'Master high-availability architecture, microservices, messaging queues, and database sharding for large-scale platforms.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i2',
      name: 'Priya Sharma',
      title: 'Ex-Staff Architect at CloudNative',
      avatarUrl: 'https://i.pravatar.cc/160?img=47',
    },

    rating: 4.8,
    reviewCount: 890,
    durationHours: 18,
    lessonCount: 42,

    price: 2499,
    originalPrice: 4999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-07-20',
  },

  {
    id: 'c3',
    slug: 'ui-ux-design-systems-figma',
    title: 'Enterprise Design Systems in Figma & React',
    description:
      'Architect scalable tokens, accessible component libraries, and visual specifications bridging product design and frontend.',
    category: 'design',
    level: 'intermediate',

    instructor: {
      id: 'i3',
      name: 'Rohan Verma',
      title: 'Design Director at Studio UX',
      avatarUrl: 'https://i.pravatar.cc/160?img=11',
    },

    rating: 4.7,
    reviewCount: 630,
    durationHours: 12,
    lessonCount: 30,

    price: 1499,
    originalPrice: 2999,

    isFeatured: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-01',
  },

  {
    id: 'c4',
    slug: 'python-data-science-machine-learning',
    title: 'Practical Machine Learning & Predictive Modeling',
    description:
      'Train, evaluate, and deploy production ML models using Python, Scikit-Learn, PyTorch, and cloud inference pipelines.',
    category: 'data-science',
    level: 'beginner',

    instructor: {
      id: 'i4',
      name: 'Dr. Ananya Roy',
      title: 'Lead AI Researcher',
      avatarUrl: 'https://i.pravatar.cc/160?img=32',
    },

    rating: 4.6,
    reviewCount: 1100,
    durationHours: 32,
    lessonCount: 78,

    price: 0,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-06-10',
  },

  {
    id: 'c5',
    slug: 'product-management-fundamentals',
    title: 'Product Strategy, Analytics & Growth Management',
    description:
      'Learn how modern PMs frame problems, run effective discovery cycles, prioritize roadmaps, and track north-star metrics.',
    category: 'business',
    level: 'beginner',

    instructor: {
      id: 'i5',
      name: 'Karan Iyer',
      title: 'VP of Product at ScaleUp',
      avatarUrl: 'https://i.pravatar.cc/160?img=68',
    },

    rating: 4.8,
    reviewCount: 450,
    durationHours: 8,
    lessonCount: 22,

    price: 1299,
    originalPrice: 2499,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-10',
  },

  {
    id: 'c6',
    slug: 'docker-kubernetes-devops-pipeline',
    title: 'Cloud-Native DevOps: Docker, K8s & Terraform',
    description:
      'Automate modern infrastructure, configure resilient CI/CD pipelines, and orchestrate containerized cloud applications.',
    category: 'devops',
    level: 'intermediate',

    instructor: {
      id: 'i6',
      name: 'Suresh Kumar',
      title: 'Senior DevOps Architect',
      avatarUrl: 'https://i.pravatar.cc/160?img=51',
    },

    rating: 4.9,
    reviewCount: 780,
    durationHours: 20,
    lessonCount: 48,

    price: 1799,
    originalPrice: 3499,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    updatedAt: '2026-07-28',
  },
  {
    id: 'c1',
    slug: 'react-nextjs-masterclass',
    title: 'React 19 & Next.js App Router Masterclass',
    description:
      'Build enterprise-grade, production-ready fullstack web applications using server actions, streaming, and modern patterns.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i1',
      name: 'Arjun Mehta',
      title: 'Principal Engineer at TechCorp',
      avatarUrl: 'https://i.pravatar.cc/160?img=12',
    },

    rating: 4.9,
    reviewCount: 1420,
    durationHours: 24,
    lessonCount: 56,

    price: 1999,
    originalPrice: 3999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-15',
  },

  {
    id: 'c2',
    slug: 'system-design-for-scale',
    title: 'System Design & Distributed Systems Architecture',
    description:
      'Master high-availability architecture, microservices, messaging queues, and database sharding for large-scale platforms.',
    category: 'development',
    level: 'advanced',

    instructor: {
      id: 'i2',
      name: 'Priya Sharma',
      title: 'Ex-Staff Architect at CloudNative',
      avatarUrl: 'https://i.pravatar.cc/160?img=47',
    },

    rating: 4.8,
    reviewCount: 890,
    durationHours: 18,
    lessonCount: 42,

    price: 2499,
    originalPrice: 4999,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-07-20',
  },

  {
    id: 'c3',
    slug: 'ui-ux-design-systems-figma',
    title: 'Enterprise Design Systems in Figma & React',
    description:
      'Architect scalable tokens, accessible component libraries, and visual specifications bridging product design and frontend.',
    category: 'design',
    level: 'intermediate',

    instructor: {
      id: 'i3',
      name: 'Rohan Verma',
      title: 'Design Director at Studio UX',
      avatarUrl: 'https://i.pravatar.cc/160?img=11',
    },

    rating: 4.7,
    reviewCount: 630,
    durationHours: 12,
    lessonCount: 30,

    price: 1499,
    originalPrice: 2999,

    isFeatured: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-01',
  },

  {
    id: 'c4',
    slug: 'python-data-science-machine-learning',
    title: 'Practical Machine Learning & Predictive Modeling',
    description:
      'Train, evaluate, and deploy production ML models using Python, Scikit-Learn, PyTorch, and cloud inference pipelines.',
    category: 'data-science',
    level: 'beginner',

    instructor: {
      id: 'i4',
      name: 'Dr. Ananya Roy',
      title: 'Lead AI Researcher',
      avatarUrl: 'https://i.pravatar.cc/160?img=32',
    },

    rating: 4.6,
    reviewCount: 1100,
    durationHours: 32,
    lessonCount: 78,

    price: 0,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-06-10',
  },

  {
    id: 'c5',
    slug: 'product-management-fundamentals',
    title: 'Product Strategy, Analytics & Growth Management',
    description:
      'Learn how modern PMs frame problems, run effective discovery cycles, prioritize roadmaps, and track north-star metrics.',
    category: 'business',
    level: 'beginner',

    instructor: {
      id: 'i5',
      name: 'Karan Iyer',
      title: 'VP of Product at ScaleUp',
      avatarUrl: 'https://i.pravatar.cc/160?img=68',
    },

    rating: 4.8,
    reviewCount: 450,
    durationHours: 8,
    lessonCount: 22,

    price: 1299,
    originalPrice: 2499,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',

    updatedAt: '2026-08-10',
  },

  {
    id: 'c6',
    slug: 'docker-kubernetes-devops-pipeline',
    title: 'Cloud-Native DevOps: Docker, K8s & Terraform',
    description:
      'Automate modern infrastructure, configure resilient CI/CD pipelines, and orchestrate containerized cloud applications.',
    category: 'devops',
    level: 'intermediate',

    instructor: {
      id: 'i6',
      name: 'Suresh Kumar',
      title: 'Senior DevOps Architect',
      avatarUrl: 'https://i.pravatar.cc/160?img=51',
    },

    rating: 4.9,
    reviewCount: 780,
    durationHours: 20,
    lessonCount: 48,

    price: 1799,
    originalPrice: 3499,

    isBestseller: true,

    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    updatedAt: '2026-07-28',
  },
];

/* ==========================================================================
   FILTER OPTIONS
========================================================================== */

export const LEVEL_OPTIONS = [
  {
    label: 'All Levels',
    value: 'all-levels',
  },
  {
    label: 'Beginner',
    value: 'beginner',
  },
  {
    label: 'Intermediate',
    value: 'intermediate',
  },
  {
    label: 'Advanced',
    value: 'advanced',
  },
] as const;

export const PRICE_OPTIONS = [
  {
    label: 'All Courses',
    value: 'all',
  },
  {
    label: 'Free',
    value: 'free',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
] as const;

export const RATING_OPTIONS = [
  {
    label: '4.5+',
    value: 4.5,
  },
  {
    label: '4.0+',
    value: 4,
  },
  {
    label: '3.5+',
    value: 3.5,
  },
] as const;

export const DURATION_OPTIONS = [
  {
    label: 'Under 2 hours',
    value: 'short',
  },
  {
    label: '2–5 hours',
    value: 'medium',
  },
  {
    label: 'Over 5 hours',
    value: 'long',
  },
] as const;

export const SORT_OPTIONS = [
  {
    label: 'Recommended',
    value: 'recommended',
  },
  {
    label: 'Most Popular',
    value: 'popular',
  },
  {
    label: 'Highest Rated',
    value: 'highest-rated',
  },
  {
    label: 'Newest',
    value: 'newest',
  },
  {
    label: 'Price: Low to High',
    value: 'price-low',
  },
  {
    label: 'Price: High to Low',
    value: 'price-high',
  },
] as const;

/* ==========================================================================
   FILTER + SORT
========================================================================== */

export function getFilteredCourses(filters: CourseFilters): {
  readonly courses: readonly Course[];
  readonly totalCount: number;
} {
  let filtered = [...COURSES_MOCK];

  /* ------------------------------------------------------------------------
     SEARCH
  ------------------------------------------------------------------------ */

  if (filters.search?.trim()) {
    const query = filters.search.trim().toLowerCase();

    filtered = filtered.filter((course) => {
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.name.toLowerCase().includes(query) ||
        course.instructor.title.toLowerCase().includes(query)
      );
    });
  }

  /* ------------------------------------------------------------------------
     CATEGORY
  ------------------------------------------------------------------------ */

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((course) => course.category === filters.category);
  }

  /* ------------------------------------------------------------------------
     LEVEL
  ------------------------------------------------------------------------ */

  if (filters.level && filters.level !== 'all-levels') {
    filtered = filtered.filter((course) => course.level === filters.level);
  }

  /* ------------------------------------------------------------------------
     PRICE
  ------------------------------------------------------------------------ */

  if (filters.price && filters.price !== 'all') {
    switch (filters.price) {
      case 'free':
        filtered = filtered.filter((course) => course.price === 0);
        break;

      case 'paid':
        filtered = filtered.filter((course) => course.price > 0);
        break;
    }
  }

  /* ------------------------------------------------------------------------
     RATING
  ------------------------------------------------------------------------ */

  if (filters.rating !== undefined) {
    filtered = filtered.filter((course) => course.rating >= filters.rating!);
  }

  /* ------------------------------------------------------------------------
     DURATION
  ------------------------------------------------------------------------ */

  if (filters.duration) {
    switch (filters.duration) {
      case 'short':
        filtered = filtered.filter((course) => course.durationHours < 2);
        break;

      case 'medium':
        filtered = filtered.filter(
          (course) => course.durationHours >= 2 && course.durationHours <= 5,
        );
        break;

      case 'long':
        filtered = filtered.filter((course) => course.durationHours > 5);
        break;
    }
  }

  /* ------------------------------------------------------------------------
     SORTING
  ------------------------------------------------------------------------ */

  switch (filters.sort ?? 'recommended') {
    case 'popular':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;

    case 'highest-rated':
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        return b.reviewCount - a.reviewCount;
      });
      break;

    case 'newest':
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;

    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;

    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;

    case 'recommended':
    default:
      filtered.sort((a, b) => {
        const bestsellerDifference =
          Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller));

        if (bestsellerDifference !== 0) {
          return bestsellerDifference;
        }

        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        return b.reviewCount - a.reviewCount;
      });

      break;
  }

  return {
    courses: filtered,
    totalCount: filtered.length,
  };
}
