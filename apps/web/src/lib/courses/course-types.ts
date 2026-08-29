export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
export type CoursePriceType = 'all' | 'free' | 'paid';
export type CourseDuration = 'short' | 'medium' | 'long'; // short: <2h, medium: 2-5h, long: 5h+
export type CourseSort =
  'recommended' | 'popular' | 'highest-rated' | 'newest' | 'price-low' | 'price-high';

export interface Instructor {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly avatarUrl: string;
}

export interface Course {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly level: CourseLevel;
  readonly instructor: Instructor;
  readonly rating: number;
  readonly reviewCount: number;
  readonly durationHours: number;
  readonly lessonCount: number;
  readonly price: number; // in INR (₹)
  readonly originalPrice?: number; // for discount calculations
  readonly isBestseller?: boolean;
  readonly isFeatured?: boolean;
  readonly imageUrl: string;
  readonly updatedAt: string;
}

export interface CourseFilters {
  readonly search?: string;
  readonly category?: string;
  readonly level?: CourseLevel;
  readonly price?: CoursePriceType;
  readonly rating?: number;
  readonly duration?: CourseDuration;
  readonly sort?: CourseSort;
  readonly page?: number;
}

export interface FilterOption {
  readonly label: string;
  readonly value: string;
  readonly count?: number;
}
