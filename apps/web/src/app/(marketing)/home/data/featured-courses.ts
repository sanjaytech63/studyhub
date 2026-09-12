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
