import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3, Heart, Star } from 'lucide-react';

import type { FeaturedCourse } from './data/featured-courses';

interface CourseCardProps {
  course: FeaturedCourse;
  priority?: boolean;
  showWishlist?: boolean;
}

export function CourseCard({ course, priority = false, showWishlist = false }: CourseCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-black/5">
      {/* =========================================================
          THUMBNAIL HEADER
      ========================================================= */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <Link
          href={`/courses/${course.slug}`}
          aria-label={`View ${course.title}`}
          className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        />

        <Image
          src={course.thumbnail}
          alt={`${course.title} course thumbnail`}
          fill
          priority={priority}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Ambient Overlay Gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
        />

        {/* Top Badges (Category & Wishlist) */}
        <div className="absolute left-3.5 top-3.5 z-20 flex w-[calc(100%-1.75rem)] items-center justify-between gap-2">
          <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {course.category.name}
          </span>

          {showWishlist && (
            <button
              type="button"
              aria-label={`Add ${course.title} to wishlist`}
              className="z-30 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Heart aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Overlay (Discount Badge) */}
        {course.discountPercentage && (
          <div className="absolute bottom-3 left-3.5 z-20">
            <span className="inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
              {course.discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      {/* =========================================================
          CONTENT BODY
      ========================================================= */}
      <div className="flex flex-1 flex-col p-5">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1 font-bold text-foreground">
            <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <span aria-hidden="true" className="text-muted-foreground/60">
            •
          </span>
          <span className="text-muted-foreground">({formatReviewCount(course.reviewCount)})</span>
        </div>

        {/* Title */}
        <h3 className="mt-2.5 line-clamp-2 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/courses/${course.slug}`} className="outline-none focus-visible:underline">
            {course.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2.5">
          <Image
            src={course.instructor.avatar}
            alt={course.instructor.name}
            width={28}
            height={28}
            className="size-7 rounded-full border border-border/80 object-cover"
          />
          <span className="truncate text-xs font-semibold text-foreground/90">
            {course.instructor.name}
          </span>
        </div>

        {/* Course Meta Info */}
        <div className="mt-3.5 flex items-center gap-3 border-t border-border/50 pt-3 text-[11px] font-medium text-muted-foreground">
          <span className="rounded-md bg-muted/60 px-2 py-0.5 text-foreground/80">
            {course.level}
          </span>
          <span aria-hidden="true" className="text-border">
            •
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" className="size-3" />
            {course.duration}
          </span>
        </div>

        {/* =========================================================
            FOOTER (PRICE + CTA)
        ========================================================= */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-border/60 pt-3.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tracking-tight text-foreground">
                {formatPrice(course.price, course.currency)}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-muted-foreground/80 line-through">
                  {formatPrice(course.originalPrice, course.currency)}
                </span>
              )}
            </div>

            <Link
              href={`/courses/${course.slug}`}
              aria-label={`Enroll in ${course.title}`}
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border/80 bg-background text-foreground shadow-xs transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/20"
            >
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Line Accent */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  );
}

/* ==================================================================
   FORMATTERS
================================================================== */

function formatPrice(value: number, currency: FeaturedCourse['currency']) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatReviewCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}
