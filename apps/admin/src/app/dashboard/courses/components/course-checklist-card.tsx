'use client';

import React from 'react';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseChecklistCardProps {
  title: string;
  thumbnailUrl: string;
  modulesCount: number;
  lessonsCount: number;
}

export function CourseChecklistCard({
  title,
  thumbnailUrl,
  modulesCount,
  lessonsCount,
}: CourseChecklistCardProps) {
  const hasTitle = Boolean(title.trim());
  const hasThumbnail = Boolean(thumbnailUrl.trim());
  const hasModules = modulesCount > 0;
  const hasLessons = lessonsCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Readiness Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-2.5 text-xs">
          <CheckCircle2
            className={`h-4 w-4 ${hasTitle ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
          />
          <span className={hasTitle ? 'text-foreground' : 'text-muted-foreground'}>
            Course title configured
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <CheckCircle2
            className={`h-4 w-4 ${hasThumbnail ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
          />
          <span className={hasThumbnail ? 'text-foreground' : 'text-muted-foreground'}>
            Thumbnail banner uploaded
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <CheckCircle2
            className={`h-4 w-4 ${hasModules ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
          />
          <span className={hasModules ? 'text-foreground' : 'text-muted-foreground'}>
            At least 1 curriculum module
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <CheckCircle2
            className={`h-4 w-4 ${hasLessons ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
          />
          <span className={hasLessons ? 'text-foreground' : 'text-muted-foreground'}>
            At least 1 video or tutorial lesson
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
