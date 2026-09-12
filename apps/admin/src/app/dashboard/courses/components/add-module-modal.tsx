'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isSubmitting: boolean;
}

export function AddModuleModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  isSubmitting,
}: AddModuleModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Curriculum Module"
      description="Organize your syllabus into logical chapters or milestone sections."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="module-title" required>
            Module Title
          </Label>
          <Input
            id="module-title"
            type="text"
            required
            placeholder="e.g. Chapter 1: Foundation, Architecture & Setup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="module-desc">Description (Optional)</Label>
          <Textarea
            id="module-desc"
            rows={3}
            placeholder="Brief summary of what competencies learners achieve in this module..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Module
          </Button>
        </div>
      </form>
    </Modal>
  );
}
