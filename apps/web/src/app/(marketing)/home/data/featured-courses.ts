export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseInstructor {
  id: string;
  name: string;
  avatar: string;
}

export interface FeaturedCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  category: {
    name: string;
    slug: string;
  };
  instructor: CourseInstructor;
  rating: number;
  reviewCount: number;
  duration: string;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  currency: 'INR';
  discountPercentage?: number;
}

export const featuredCourses: FeaturedCourse[] = [
  {
    id: 'course-react-nextjs',
    slug: 'react-nextjs-masterclass',
    title: 'React & Next.js Masterclass',
    description:
      'Build production-ready web applications with React, Next.js, TypeScript, and modern frontend architecture.',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85',
    category: {
      name: 'Web Development',
      slug: 'web-development',
    },
    instructor: {
      id: 'instructor-alex-morgan',
      name: 'Alex Morgan',
      avatar: 'https://i.pravatar.cc/160?img=12',
    },
    rating: 4.9,
    reviewCount: 2400,
    duration: '18h 40m',
    level: 'Intermediate',
    price: 2499,
    originalPrice: 4999,
    currency: 'INR',
    discountPercentage: 50,
  },
  {
    id: 'course-nodejs-backend',
    slug: 'nodejs-production-backend',
    title: 'Node.js Production Backend',
    description:
      'Design scalable APIs, authentication systems, background jobs, and production-ready Node.js services.',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85',
    category: {
      name: 'Web Development',
      slug: 'web-development',
    },
    instructor: {
      id: 'instructor-daniel-lee',
      name: 'Daniel Lee',
      avatar: 'https://i.pravatar.cc/160?img=13',
    },
    rating: 4.8,
    reviewCount: 1840,
    duration: '15h 25m',
    level: 'Advanced',
    price: 2199,
    originalPrice: 4499,
    currency: 'INR',
    discountPercentage: 51,
  },
  {
    id: 'course-ui-ux',
    slug: 'product-ui-ux-design',
    title: 'Product UI/UX Design',
    description:
      'Learn product thinking, interface design, prototyping, and scalable design-system fundamentals.',
    thumbnail:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85',
    category: {
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
    },
    instructor: {
      id: 'instructor-emma-wilson',
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/160?img=47',
    },
    rating: 4.9,
    reviewCount: 1260,
    duration: '12h 10m',
    level: 'Intermediate',
    price: 1899,
    originalPrice: 3999,
    currency: 'INR',
    discountPercentage: 53,
  },
  {
    id: 'course-python-data',
    slug: 'python-data-science',
    title: 'Python for Data Science',
    description:
      'Learn Python, data analysis, visualization, and practical workflows used by modern data teams.',
    thumbnail:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=85',
    category: {
      name: 'Data Science',
      slug: 'data-science',
    },
    instructor: {
      id: 'instructor-noah-patel',
      name: 'Noah Patel',
      avatar: 'https://i.pravatar.cc/160?img=11',
    },
    rating: 4.8,
    reviewCount: 980,
    duration: '16h 35m',
    level: 'Beginner',
    price: 1999,
    originalPrice: 3999,
    currency: 'INR',
    discountPercentage: 50,
  },
];
