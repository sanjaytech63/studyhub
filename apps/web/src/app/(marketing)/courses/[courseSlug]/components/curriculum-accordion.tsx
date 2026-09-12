'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, FileText, Lock, Eye } from 'lucide-react';
import type { Lesson } from '@studyhub/types';

interface CurriculumModule {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly orderIndex: number;
  readonly lessons: Lesson[];
}

interface CurriculumAccordionProps {
  readonly modules: CurriculumModule[];
  readonly onSelectPreviewLesson: (lesson: Lesson) => void;
}

export function CurriculumAccordion({ modules, onSelectPreviewLesson }: CurriculumAccordionProps) {
  // First module open by default
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>(() => {
    if (modules.length > 0 && modules[0]) {
      return { [modules[0].id]: true };
    }
    return {};
  });

  const toggleModule = (id: string) => {
    setOpenModuleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0,
  );
  const durationHours = Math.round(totalDuration / 60);

  return (
    <section aria-labelledby="curriculum-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2
            id="curriculum-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            Course Curriculum
          </h2>
          <p className="text-sm text-muted-foreground">
            {modules.length} Modules · {totalLessons} Lessons · {durationHours}h+ Total Length
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const allOpen = modules.every((m) => openModuleIds[m.id]);
            const nextState: Record<string, boolean> = {};
            for (const m of modules) {
              nextState[m.id] = !allOpen;
            }
            setOpenModuleIds(nextState);
          }}
          className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          Toggle All Modules
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {modules.map((module, idx) => {
          const isOpen = Boolean(openModuleIds[module.id]);
          const moduleDuration = module.lessons.reduce((acc, l) => acc + l.durationMinutes, 0);
          const hasFreePreview = module.lessons.some((l) => l.isFreePreview);

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-lg border border-border/80 bg-card transition-all"
            >
              {/* Module Header Bar */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold font-mono text-muted-foreground">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {hasFreePreview && (
                    <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500 border border-emerald-500/20">
                      Preview available
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {module.lessons.length} lessons · {moduleDuration}m
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="border-t border-border/40 divide-y divide-border/30 bg-muted/10">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        {lesson.type === 'ARTICLE' ? (
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="text-xs sm:text-sm text-foreground truncate">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground font-mono">
                          {lesson.durationMinutes}m
                        </span>

                        {lesson.isFreePreview ? (
                          <button
                            type="button"
                            onClick={() => onSelectPreviewLesson(lesson)}
                            className="inline-flex items-center gap-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold border border-primary/25 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </button>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
