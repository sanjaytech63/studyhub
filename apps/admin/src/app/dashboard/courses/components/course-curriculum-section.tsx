'use client';

import React from 'react';
import { Clock, FileText, Layers, Plus, Trash2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { AdminModule, AdminLesson } from '@/services/admin-lms.service';

interface CourseCurriculumSectionProps {
  modules: AdminModule[];
  onOpenAddModule: () => void;
  onOpenAddLesson: (moduleId: string) => void;
  onRequestDelete: (target: { type: 'module' | 'lesson'; id: string; title: string }) => void;
}

export function CourseCurriculumSection({
  modules,
  onOpenAddModule,
  onOpenAddLesson,
  onRequestDelete,
}: CourseCurriculumSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Curriculum &amp; Syllabus
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize modules, upload video lectures or tutorials, and enable free previews.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenAddModule}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-6 w-6" />}
          title="No modules created yet"
          message="Your course curriculum is empty. Add your first section module to begin structuring lessons and chapters for your learners."
          actionLabel="Create First Module"
          onAction={onOpenAddModule}
        />
      ) : (
        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <Card key={mod.id} className="transition-all shadow-xs border-border/80">
              {/* Module Header Strip */}
              <div className="p-4 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono">
                    {String(modIdx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{mod.title}</h4>
                      <Badge variant="outline" size="sm" withDot={false}>
                        {mod.lessons?.length || 0}{' '}
                        {(mod.lessons?.length || 0) === 1 ? 'lesson' : 'lessons'}
                      </Badge>
                    </div>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {mod.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenAddLesson(mod.id)}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add Lesson
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="iconSm"
                    className="text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    onClick={() =>
                      onRequestDelete({
                        type: 'module',
                        id: mod.id,
                        title: mod.title,
                      })
                    }
                    title="Delete module"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Module Lessons Container */}
              <div className="p-4">
                {!mod.lessons || mod.lessons.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="h-4 w-4" />}
                    title="No lessons in this module"
                    message="Add video lectures or rich markdown articles to this curriculum module."
                    actionLabel="Add Lesson"
                    onAction={() => onOpenAddLesson(mod.id)}
                  />
                ) : (
                  <div className="divide-y divide-border/40">
                    {mod.lessons.map((lesson: AdminLesson, lessonIdx: number) => (
                      <div
                        key={lesson.id}
                        className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 hover:bg-muted/10 px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            {lesson.type === 'VIDEO' ? (
                              <Video className="h-4 w-4 text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground truncate">
                                {modIdx + 1}.{lessonIdx + 1} {lesson.title}
                              </span>
                              {lesson.isFreePreview && (
                                <Badge variant="active" size="sm" className="text-[10px]">
                                  Free Preview
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {lesson.durationMinutes} min
                              </span>
                              <span className="font-mono text-muted-foreground/60 hidden sm:inline">
                                /{lesson.slug}
                              </span>
                              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/80">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="iconSm"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() =>
                            onRequestDelete({
                              type: 'lesson',
                              id: lesson.id,
                              title: lesson.title,
                            })
                          }
                          title="Delete lesson"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
