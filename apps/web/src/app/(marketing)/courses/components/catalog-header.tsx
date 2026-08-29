import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CatalogHeaderProps {
  readonly totalCourses: number;
}

export function CatalogHeader({ totalCourses }: CatalogHeaderProps) {
  return (
    <header className="space-y-3 pb-6 border-b border-border/40">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-medium text-foreground">Courses</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-1.5 max-w-3xl">
        <span className="text-xs font-bold tracking-wider text-primary uppercase">
          Explore Courses
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          Learn skills that move you forward.
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Discover practical courses from experienced instructors and build skills you can apply
          directly to real-world projects.
        </p>
      </div>

      {/* Course Count */}
      <div className="pt-1">
        <span className="text-xs font-semibold text-foreground/80 bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
          {totalCourses}+ Courses Available
        </span>
      </div>
    </header>
  );
}
