'use client';

import React from 'react';
import { BookOpen, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryItem {
  id: string;
  name: string;
}

interface CourseOverviewFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  onGenerateSlug: () => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  categories: CategoryItem[];
  isCategoriesLoading: boolean;
  level: string;
  setLevel: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  subtitle: string;
  setSubtitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  outcomeDescription: string;
  setOutcomeDescription: (val: string) => void;
}

export function CourseOverviewForm({
  title,
  setTitle,
  slug,
  setSlug,
  onGenerateSlug,
  categoryId,
  setCategoryId,
  categories,
  isCategoriesLoading,
  level,
  setLevel,
  price,
  setPrice,
  subtitle,
  setSubtitle,
  description,
  setDescription,
  outcomeDescription,
  setOutcomeDescription,
}: CourseOverviewFormProps) {
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedLevelName =
    level === 'BEGINNER'
      ? 'Beginner'
      : level === 'INTERMEDIATE'
        ? 'Intermediate'
        : level === 'ADVANCED'
          ? 'Advanced'
          : level === 'ALL_LEVELS'
            ? 'All Levels'
            : level;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>
              Configure foundational details, categories, and public marketing copy.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="course-title" required>
            Course Title
          </Label>
          <Input
            id="course-title"
            type="text"
            required
            placeholder="e.g. Master Production Microservices with Node.js & Go"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Slug & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="course-slug">URL Slug</Label>
              <button
                type="button"
                onClick={onGenerateSlug}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Generate from Title
              </button>
            </div>
            <Input
              id="course-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-xs"
              placeholder="production-microservices-course"
              leftIcon={<Hash className="h-3.5 w-3.5 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course-category">Category</Label>
            <Select
              value={categoryId || 'none'}
              onValueChange={(val) => setCategoryId(val === 'none' ? '' : val || '')}
              disabled={isCategoriesLoading}
            >
              <SelectTrigger id="course-category" className="w-full">
                <SelectValue
                  placeholder={isCategoriesLoading ? 'Loading categories...' : 'Select a category'}
                >
                  {selectedCategory?.name ||
                    (categoryId && categoryId !== 'none'
                      ? selectedCategory?.name || 'Selected Category'
                      : 'Uncategorized')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skill Level & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="course-level">Target Skill Level</Label>
            <Select value={level} onValueChange={(val) => setLevel(val || 'INTERMEDIATE')}>
              <SelectTrigger id="course-level" className="w-full">
                <SelectValue placeholder="Select skill level">{selectedLevelName}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
                <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course-price">Price (INR ₹)</Label>
            <Input
              id="course-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono"
              placeholder="0 for free"
              leftIcon={<span className="text-xs font-bold text-muted-foreground">₹</span>}
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <Label htmlFor="course-subtitle">Subtitle / Tagline</Label>
          <Input
            id="course-subtitle"
            type="text"
            placeholder="Short, punchy summary displayed below title in hero cards"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        {/* Full Description */}
        <div className="space-y-1.5">
          <Label htmlFor="course-description">Course Description</Label>
          <Textarea
            id="course-description"
            rows={4}
            placeholder="Comprehensive description outlining background, curriculum roadmap, and prerequisites..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>

        {/* What You'll Build */}
        <div className="space-y-1.5">
          <Label htmlFor="course-outcome">What You&apos;ll Build &amp; Key Takeaways</Label>
          <Textarea
            id="course-outcome"
            rows={3}
            placeholder="e.g. Distributed event streaming pipeline, Kubernetes deployment manifests, Capstone SaaS application..."
            value={outcomeDescription}
            onChange={(e) => setOutcomeDescription(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
