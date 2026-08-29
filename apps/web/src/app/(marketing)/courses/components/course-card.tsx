import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, BookOpen, UserCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Course } from '@/lib/courses/course-types';

interface CourseCardProps {
  readonly course: Course;
  readonly priorityImage?: boolean;
}

export function CourseCard({ course, priorityImage = false }: CourseCardProps) {
  const isFree = course.price === 0;
  const formattedPrice = isFree ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`;
  const formattedOriginalPrice = course.originalPrice
    ? `₹${course.originalPrice.toLocaleString('en-IN')}`
    : null;

  return (
    <article className="group h-full flex flex-col">
      <Card className="flex flex-col h-full overflow-hidden border border-border/60 bg-card transition-all duration-200 hover:border-border hover:shadow-xs rounded-xl">
        {/* Course Thumbnail Wrapper */}
        <Link
          href={`/courses/${course.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="relative aspect-video w-full overflow-hidden bg-muted"
        >
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priorityImage}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Badge Overlays */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {course.isBestseller && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                Bestseller
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-background/90 text-foreground backdrop-blur-xs text-[10px] font-medium px-2 py-0.5 rounded-md border border-border/40"
            >
              {course.category.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </Link>

        {/* Card Content Body */}
        <CardContent className="flex flex-col flex-1 p-4 sm:p-5">
          {/* Instructor Line */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <UserCircle2 className="size-3.5 text-muted-foreground/80 shrink-0" />
            <span className="truncate font-medium">{course.instructor.name}</span>
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            <Link
              href={`/courses/${course.slug}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
            >
              {course.title}
            </Link>
          </h2>

          {/* Description */}
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Metadata Row */}
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground/90 border-t border-border/40 pt-3">
            <div className="flex items-center gap-1">
              <Clock className="size-3.5 shrink-0" />
              <span>{course.durationHours}h</span>
            </div>
            <span aria-hidden="true" className="text-muted-foreground/40">
              •
            </span>
            <div className="flex items-center gap-1">
              <BookOpen className="size-3.5 shrink-0" />
              <span>{course.lessonCount} lessons</span>
            </div>
            <span aria-hidden="true" className="text-muted-foreground/40">
              •
            </span>
            <span className="capitalize font-medium text-foreground/80">{course.level}</span>
          </div>
        </CardContent>

        {/* Card Footer: Rating & Pricing */}
        <CardFooter className="flex items-center justify-between border-t border-border/40 px-4 py-3 sm:px-5 bg-muted/20 mt-auto">
          {/* Rating */}
          <div
            className="flex items-center gap-1.5"
            aria-label={`Rated ${course.rating} out of 5 stars`}
          >
            <div className="flex items-center text-amber-500">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-foreground">{course.rating.toFixed(1)}</span>
            <span className="text-[11px] text-muted-foreground">
              ({course.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 text-right">
            {formattedOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-foreground tracking-tight">
              {formattedPrice}
            </span>
          </div>
        </CardFooter>
      </Card>
    </article>
  );
}
