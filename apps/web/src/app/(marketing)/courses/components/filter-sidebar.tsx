'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '../data/courses';
import { CourseFilters } from '@/lib/courses/course-types';

interface FilterSidebarProps {
  readonly filters: CourseFilters;
}

export function FilterSidebar({ filters }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all' && value !== 'all-levels') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h3 className="text-sm font-bold tracking-tight text-foreground">Filter Courses</h3>
      </div>

      <Accordion defaultValue={['category', 'level', 'price', 'rating']} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="category" className="border-border/60">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
            Category
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <RadioGroup
              defaultValue={filters.category || 'all'}
              onValueChange={(val) => updateParam('category', val)}
              className="space-y-2.5"
            >
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2.5">
                  <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} />
                  <Label
                    htmlFor={`cat-${cat.value}`}
                    className="text-xs font-medium cursor-pointer text-foreground/90"
                  >
                    {cat.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Level Filter */}
        <AccordionItem value="level" className="border-border/60">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
            Skill Level
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <RadioGroup
              defaultValue={filters.level || 'all-levels'}
              onValueChange={(val) => updateParam('level', val)}
              className="space-y-2.5"
            >
              {[
                { label: 'All Levels', value: 'all-levels' },
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
              ].map((lvl) => (
                <div key={lvl.value} className="flex items-center space-x-2.5">
                  <RadioGroupItem value={lvl.value} id={`lvl-${lvl.value}`} />
                  <Label
                    htmlFor={`lvl-${lvl.value}`}
                    className="text-xs font-medium cursor-pointer text-foreground/90"
                  >
                    {lvl.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-border/60">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
            Price
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <RadioGroup
              defaultValue={filters.price || 'all'}
              onValueChange={(val) => updateParam('price', val)}
              className="space-y-2.5"
            >
              {[
                { label: 'All Prices', value: 'all' },
                { label: 'Free', value: 'free' },
                { label: 'Paid', value: 'paid' },
              ].map((pr) => (
                <div key={pr.value} className="flex items-center space-x-2.5">
                  <RadioGroupItem value={pr.value} id={`pr-${pr.value}`} />
                  <Label
                    htmlFor={`pr-${pr.value}`}
                    className="text-xs font-medium cursor-pointer text-foreground/90"
                  >
                    {pr.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating" className="border-border/60">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
            Rating
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            {[4.5, 4.0, 3.5].map((stars) => (
              <div key={stars} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${stars}`}
                  checked={filters.rating === stars}
                  onCheckedChange={(checked) =>
                    updateParam('rating', checked ? stars.toString() : null)
                  }
                />
                <Label
                  htmlFor={`rating-${stars}`}
                  className="text-xs font-medium cursor-pointer text-foreground/90"
                >
                  {stars}+ Stars & above
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
