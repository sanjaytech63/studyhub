'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { COURSE_TABS, type CourseTab } from './new-course-types';

interface NewCourseTabsProps {
  activeTab: CourseTab;
  setActiveTab: (tab: CourseTab) => void;
  totalLessons: number;
}

export function NewCourseTabs({ activeTab, setActiveTab, totalLessons }: NewCourseTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 pb-2">
      {COURSE_TABS.map(({ id, label, icon: Icon }, index) => {
        const isActive = activeTab === id;

        return (
          <Button
            key={id}
            type="button"
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(id)}
            className="shrink-0 gap-2"
            leftIcon={<Icon className="h-4 w-4" />}
          >
            {index + 1}. {label}
            {id === 'curriculum' && <span className="ml-0.5">({totalLessons} Lessons)</span>}
          </Button>
        );
      })}
    </div>
  );
}
