'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseStatusCardProps {
  status: string;
  modulesCount: number;
  lessonsCount: number;
  formattedDuration: string;
  onPublish: () => void;
  isPublishing: boolean;
}

export function CourseStatusCard({
  status,
  modulesCount,
  lessonsCount,
  formattedDuration,
  onPublish,
  isPublishing,
}: CourseStatusCardProps) {
  const isPublished = status === 'PUBLISHED';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Course Status</span>
          <Badge variant={isPublished ? 'active' : 'suspended'} size="sm">
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isPublished
            ? 'This course is publicly accessible in the student catalog. Updates to modules and metadata will reflect live immediately upon saving.'
            : 'This course is in draft mode and is only visible to organization administrators and instructors.'}
        </p>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/20 p-3 border border-border/50 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Modules</div>
            <div className="text-base font-bold text-foreground font-mono mt-0.5">
              {modulesCount}
            </div>
          </div>
          <div className="border-x border-border/50">
            <div className="text-xs text-muted-foreground">Lessons</div>
            <div className="text-base font-bold text-foreground font-mono mt-0.5">
              {lessonsCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="text-base font-bold text-foreground font-mono mt-0.5">
              {formattedDuration}
            </div>
          </div>
        </div>

        {!isPublished && (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center"
            onClick={onPublish}
            isLoading={isPublishing}
            leftIcon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          >
            Publish Course Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
