'use client';

import React from 'react';
import { Eye, FileText, FolderOpen, Plus, Trash2, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { LessonDraft, ModuleDraft } from './new-course-types';

interface StepCurriculumProps {
  modules: ModuleDraft[];
  onAddModule: () => void;
  onRemoveModule: (moduleId: string) => void;
  onUpdateModule: (moduleId: string, field: 'title' | 'description', value: string) => void;
  onAddLesson: (moduleId: string) => void;
  onRemoveLesson: (moduleId: string, lessonId: string) => void;
  onUpdateLesson: (moduleId: string, lessonId: string, patch: Partial<LessonDraft>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepCurriculum({
  modules,
  onAddModule,
  onRemoveModule,
  onUpdateModule,
  onAddLesson,
  onRemoveLesson,
  onUpdateLesson,
  onBack,
  onNext,
}: StepCurriculumProps) {
  return (
    <div className="space-y-6">
      {/* Curriculum Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">
          Add modules and lessons. Enable{' '}
          <span className="font-semibold text-emerald-500">Free Preview</span> on introductory
          lessons for prospective learners.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onAddModule}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          className="self-start sm:self-auto"
        >
          Add Module
        </Button>
      </div>

      {/* Empty State */}
      {modules.length === 0 ? (
        <Card className="rounded-2xl border-dashed p-12 text-center">
          <div className="mx-auto flex max-w-sm flex-col items-center space-y-3">
            <FolderOpen className="size-10 text-muted-foreground" />

            <h3 className="text-sm font-bold text-foreground">No syllabus modules added yet</h3>

            <p className="text-xs text-muted-foreground">
              Break down your course into chapters or modules, then add video and article lessons.
            </p>

            <Button
              type="button"
              variant="primary"
              onClick={onAddModule}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add First Module
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id} className="space-y-4 p-5">
              {/* Module Header */}
              <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <Label htmlFor={`module-title-${module.id}`} className="sr-only">
                    Module {moduleIndex + 1} title
                  </Label>

                  <Input
                    id={`module-title-${module.id}`}
                    type="text"
                    value={module.title}
                    onChange={(event) => onUpdateModule(module.id, 'title', event.target.value)}
                    placeholder="Module Title"
                    className="h-8 rounded-none border-0  bg-transparent px-0 text-sm font-bold focus-visible:border-primary focus-visible:ring-0"
                  />

                  <Label htmlFor={`module-description-${module.id}`} className="sr-only">
                    Module {moduleIndex + 1} description
                  </Label>

                  <Input
                    id={`module-description-${module.id}`}
                    type="text"
                    value={module.description}
                    onChange={(event) =>
                      onUpdateModule(module.id, 'description', event.target.value)
                    }
                    placeholder="Module summary or learning goals..."
                    className="h-7 rounded-none border-0 bg-transparent px-0 text-xs text-muted-foreground focus-visible:ring-0"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="iconSm"
                  onClick={() => onRemoveModule(module.id)}
                  title="Delete module"
                  aria-label={`Delete module ${moduleIndex + 1}`}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Lessons */}
              <div className="space-y-3 border-l-2 border-primary/20 pl-4">
                {module.lessons.length === 0 && (
                  <p className="py-2 text-xs text-muted-foreground">
                    No lessons added to this module yet.
                  </p>
                )}

                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border border-border/50 bg-background/60 p-3 sm:flex-row sm:items-center"
                  >
                    {/* Lesson Name */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {lesson.type === 'VIDEO' ? (
                        <Video className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-amber-500" />
                      )}

                      <Label htmlFor={`lesson-title-${lesson.id}`} className="sr-only">
                        Lesson {lessonIndex + 1} title
                      </Label>

                      <Input
                        id={`lesson-title-${lesson.id}`}
                        type="text"
                        value={lesson.title}
                        onChange={(event) =>
                          onUpdateLesson(module.id, lesson.id, {
                            title: event.target.value,
                          })
                        }
                        className="h-7 flex-1 rounded-none border-0 bg-transparent px-0 text-xs font-medium focus-visible:ring-0"
                        placeholder="Lesson Title"
                      />
                    </div>

                    {/* Lesson Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Duration */}
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor={`lesson-duration-${lesson.id}`} className="sr-only">
                          Lesson duration
                        </Label>

                        <Input
                          id={`lesson-duration-${lesson.id}`}
                          type="number"
                          min={1}
                          value={lesson.durationMinutes}
                          onChange={(event) =>
                            onUpdateLesson(module.id, lesson.id, {
                              durationMinutes: Number(event.target.value) || 1,
                            })
                          }
                          className="h-8 w-16 px-1 text-center font-mono text-[11px]"
                        />

                        <span className="text-[11px] text-muted-foreground">min</span>
                      </div>

                      {/* Free Preview */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`lesson-preview-${lesson.id}`}
                          checked={lesson.isFreePreview}
                          onCheckedChange={(checked) =>
                            onUpdateLesson(module.id, lesson.id, {
                              isFreePreview: checked === true,
                            })
                          }
                        />

                        <Label
                          htmlFor={`lesson-preview-${lesson.id}`}
                          className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-bold"
                        >
                          <Eye className="h-3 w-3" />
                          {lesson.isFreePreview ? 'Free Preview' : 'Locked'}
                        </Label>
                      </div>

                      {/* Delete Lesson */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="iconSm"
                        onClick={() => onRemoveLesson(module.id, lesson.id)}
                        aria-label={`Delete lesson ${lessonIndex + 1}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Lesson */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddLesson(module.id)}
                  leftIcon={<Plus className="h-3 w-3" />}
                  className="h-8 px-0 text-[11px] font-semibold text-primary hover:bg-transparent hover:text-primary hover:underline"
                >
                  Add Lesson to Module {moduleIndex + 1}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Curriculum Navigation */}
      <div className="flex justify-between gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>

        <Button type="button" variant="primary" onClick={onNext}>
          Review &amp; Publish →
        </Button>
      </div>
    </div>
  );
}
