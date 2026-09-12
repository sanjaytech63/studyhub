'use client';

import React from 'react';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateCourseFormValues } from '@/lib/admin/courses.schema';

interface CategoryItem {
  id: string;
  name: string;
}

interface StepInfoProps {
  register: UseFormRegister<CreateCourseFormValues>;
  control: Control<CreateCourseFormValues>;
  errors: FieldErrors<CreateCourseFormValues>;
  onTitleChange: (val: string) => void;
  onNext: () => void;
  categories: CategoryItem[];
  isCategoriesLoading: boolean;
}

export function StepInfo({
  register,
  control,
  errors,
  onTitleChange,
  onNext,
  categories,
  isCategoriesLoading,
}: StepInfoProps) {
  return (
    <Card className="max-w-3xl space-y-6 p-6">
      {/* Course Title */}
      <div className="space-y-1.5">
        <Label htmlFor="course-title" className="text-xs font-semibold text-foreground">
          Course Title *
        </Label>

        <Input
          id="course-title"
          type="text"
          placeholder="e.g. Master Go & Distributed Microservices"
          {...register('title')}
          onChange={(event) => onTitleChange(event.target.value)}
          error={errors.title?.message}
        />
      </div>

      {/* URL Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="course-slug" className="text-xs font-semibold text-foreground">
          URL Slug *
        </Label>

        <Input
          id="course-slug"
          type="text"
          placeholder="master-go-and-distributed-microservices"
          {...register('slug')}
          className="font-mono"
          error={errors.slug?.message}
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-1.5">
        <Label htmlFor="course-subtitle" className="text-xs font-semibold text-foreground">
          Subtitle / Punchline
        </Label>

        <Input
          id="course-subtitle"
          type="text"
          placeholder="Build high-performance microservices, gRPC engines, and resilient Kafka pipelines."
          {...register('subtitle')}
          error={errors.subtitle?.message}
        />
      </div>

      {/* Level + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Level */}
        <div className="space-y-1.5">
          <Label htmlFor="course-level" className="text-xs font-semibold text-foreground">
            Skill Level
          </Label>

          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="course-level" className="w-full">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.level && <p className="text-[11px] text-destructive">{errors.level.message}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="course-category" className="text-xs font-semibold text-foreground">
            Category *
          </Label>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                disabled={isCategoriesLoading}
              >
                <SelectTrigger id="course-category" className="w-full">
                  <SelectValue
                    placeholder={
                      isCategoriesLoading ? 'Loading categories...' : 'Select course category'
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                      No categories available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {errors.categoryId && (
            <p className="text-[11px] text-destructive">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="course-description" className="text-xs font-semibold text-foreground">
          Comprehensive Description
        </Label>

        <Textarea
          id="course-description"
          rows={5}
          placeholder="Explain the hands-on project journey, prerequisite expectations, and industry relevance..."
          {...register('description')}
          className="resize-none"
        />

        {errors.description && (
          <p className="text-[11px] text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Next */}
      <div className="flex justify-end">
        <Button type="button" variant="primary" onClick={onNext}>
          Continue to Pricing →
        </Button>
      </div>
    </Card>
  );
}
