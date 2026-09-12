'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/common/file-upload';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onTitleChange: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  type: 'VIDEO' | 'ARTICLE';
  setType: (val: 'VIDEO' | 'ARTICLE') => void;
  duration: string;
  setDuration: (val: string) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  contentMarkdown: string;
  setContentMarkdown: (val: string) => void;
  isFreePreview: boolean;
  setIsFreePreview: (val: boolean) => void;
  isSubmitting: boolean;
}

export function AddLessonModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  slug,
  setSlug,
  type,
  setType,
  duration,
  setDuration,
  videoUrl,
  setVideoUrl,
  contentMarkdown,
  setContentMarkdown,
  isFreePreview,
  setIsFreePreview,
  isSubmitting,
}: AddLessonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Lesson to Module"
      description="Upload video lectures or compose markdown tutorials for students."
      maxWidth="lg"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="lesson-title" required>
            Lesson Title
          </Label>
          <Input
            id="lesson-title"
            type="text"
            required
            placeholder="e.g. Setting up Docker Compose & PostgreSQL Database"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="lesson-slug" required>
              URL Slug
            </Label>
            <Input
              id="lesson-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-xs"
              placeholder="docker-compose-postgres-setup"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lesson-duration" required>
              Estimated Duration (Minutes)
            </Label>
            <Input
              id="lesson-duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="lesson-type">Lesson Type</Label>
            <Select
              value={type}
              onValueChange={(val) => setType((val as 'VIDEO' | 'ARTICLE') || 'VIDEO')}
            >
              <SelectTrigger id="lesson-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video Lecture</SelectItem>
                <SelectItem value="ARTICLE">Article / Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 pb-2.5">
            <Checkbox
              id="free-preview-checkbox"
              checked={isFreePreview}
              onCheckedChange={(checked) => setIsFreePreview(checked === true)}
            />
            <Label
              htmlFor="free-preview-checkbox"
              className="cursor-pointer text-xs font-semibold text-foreground mb-0 flex items-center gap-1.5 normal-case"
            >
              {isFreePreview ? (
                <Eye className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              Enable as Free Preview
            </Label>
          </div>
        </div>

        {type === 'VIDEO' ? (
          <div className="space-y-1.5 pt-2">
            <FileUpload
              label="Lesson Video (Cloudinary)"
              description="Upload the lecture video file (MP4, WEBM, MOV, max 200MB)"
              accept="video/*"
              maxSizeBytes={200 * 1024 * 1024}
              value={videoUrl}
              onChange={(url) => setVideoUrl(url)}
            />
          </div>
        ) : (
          <div className="space-y-1.5 pt-2">
            <Label htmlFor="lesson-markdown">Markdown Content</Label>
            <Textarea
              id="lesson-markdown"
              rows={7}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              placeholder="Write full article tutorial content, code blocks, diagrams, and instructions in Markdown..."
              className="font-mono text-xs resize-none"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Add Lesson
          </Button>
        </div>
      </form>
    </Modal>
  );
}
