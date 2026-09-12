'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/common/file-upload';
import type { CreateCourseFormValues } from '@/lib/admin/courses.schema';

interface StepPricingProps {
  register: UseFormRegister<CreateCourseFormValues>;
  setValue: UseFormSetValue<CreateCourseFormValues>;
  errors: FieldErrors<CreateCourseFormValues>;
  isFree?: boolean;
  thumbnailUrl?: string;
  onBack: () => void;
  onNext: () => void;
}

export function StepPricing({
  register,
  setValue,
  errors,
  isFree,
  thumbnailUrl,
  onBack,
  onNext,
}: StepPricingProps) {
  return (
    <Card className="max-w-3xl space-y-6 p-6">
      {/* Free Course */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="is-free-toggle"
          checked={Boolean(isFree)}
          onCheckedChange={(checked) => {
            setValue('isFree', checked === true, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />

        <Label
          htmlFor="is-free-toggle"
          className="cursor-pointer text-xs font-semibold text-foreground"
        >
          Make this a 100% Free Course
        </Label>
      </div>

      {/* Price */}
      {!isFree && (
        <div className="space-y-1.5">
          <Label htmlFor="course-price" className="text-xs font-semibold text-foreground">
            Course Price (INR ₹) *
          </Label>

          <Input
            id="course-price"
            type="number"
            min={0}
            placeholder="e.g. 2499"
            {...register('price', {
              valueAsNumber: true,
            })}
            className="font-mono"
            error={errors.price?.message}
          />

          <p className="text-[11px] text-muted-foreground">
            Learners can apply backend promotional discount coupons during checkout.
          </p>
        </div>
      )}

      {/* Course Thumbnail */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <ImageIcon className="h-4 w-4 text-primary" />
          Course Thumbnail
        </Label>

        <FileUpload
          label=""
          description="Upload course thumbnail cover image (16:9 recommended)"
          accept="image/*"
          value={thumbnailUrl || ''}
          onChange={(url) =>
            setValue('thumbnailUrl', url, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />

        <div className="space-y-1.5">
          <Label htmlFor="thumbnail-url" className="text-[11px] text-muted-foreground">
            Or direct Image URL:
          </Label>

          <Input
            id="thumbnail-url"
            type="text"
            placeholder="https://images.unsplash.com/... or Cloudinary URL"
            {...register('thumbnailUrl')}
            className="font-mono"
            error={errors.thumbnailUrl?.message}
          />
        </div>
      </div>

      {/* Outcome */}
      <div className="space-y-1.5">
        <Label htmlFor="outcome-description" className="text-xs font-semibold text-foreground">
          What You&apos;ll Build Architecture (Deliverables)
        </Label>

        <Textarea
          id="outcome-description"
          rows={4}
          placeholder="Describe the production-grade application architecture students will create from scratch..."
          {...register('outcomeDescription')}
          className="resize-none"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>

        <Button type="button" variant="primary" onClick={onNext}>
          Continue to Curriculum →
        </Button>
      </div>
    </Card>
  );
}
