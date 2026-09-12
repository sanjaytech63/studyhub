'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useEnrolledCourses, useStudentCertificates } from '@/lib/learning/learning.queries';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'certificates'>('all');

  const { data: courses = [], isLoading: isLoadingCourses } = useEnrolledCourses();
  const { data: certificates = [], isLoading: isLoadingCertificates } = useStudentCertificates();

  const loading = isLoadingCourses || isLoadingCertificates;

  const inProgressCourses = courses.filter((c) => !c.progress?.isCompleted);
  const completedCourses = courses.filter((c) => c.progress?.isCompleted);

  const displayedCourses = activeTab === 'in-progress' ? inProgressCourses : courses;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <GraduationCap className="size-7 text-primary" />
            My Learning & Progression
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Track your hands-on engineering journey, resume active lessons, and view earned
            credentials.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="self-start sm:self-auto rounded-lg">
          <Link href="/courses" className="flex items-center gap-1.5">
            <BookOpen className="size-4" />
            <span>Explore More Courses</span>
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border/60 bg-card/60 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-primary" />
            Enrolled Courses
          </span>
          <p className="mt-1.5 text-2xl font-bold font-mono text-foreground">{courses.length}</p>
        </Card>

        <Card className="p-4 border-border/60 bg-card/60 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber-500" />
            In Progress
          </span>
          <p className="mt-1.5 text-2xl font-bold font-mono text-foreground">
            {inProgressCourses.length}
          </p>
        </Card>

        <Card className="p-4 border-border/60 bg-card/60 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Completed
          </span>
          <p className="mt-1.5 text-2xl font-bold font-mono text-foreground">
            {completedCourses.length}
          </p>
        </Card>

        <Card className="p-4 border-border/60 bg-card/60 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Award className="size-3.5 text-indigo-500" />
            Certificates
          </span>
          <p className="mt-1.5 text-2xl font-bold font-mono text-foreground">
            {certificates.length}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="size-3.5" />
          All Enrolled ({courses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('in-progress')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'in-progress'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="size-3.5" />
          Active Courses ({inProgressCourses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'certificates'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="size-3.5" />
          Certificates ({certificates.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card p-4"
            >
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : activeTab === 'certificates' ? (
        /* Certificates Tab */
        certificates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
            <Award className="size-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-3 text-base font-bold text-foreground">No certificates yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Complete 100% of your course lessons to earn verifiable credentials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="group overflow-hidden border-border/80 bg-card/60 shadow-xs hover:border-primary/40 transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      VERIFIED
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground line-clamp-1">
                    {cert.course?.title || 'Course Certificate'}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    Credential ID: {cert.certificateCode}
                  </p>
                </div>

                <CardFooter className="border-t border-border/40 p-4 bg-muted/20">
                  <Button asChild size="sm" className="w-full rounded-lg">
                    <Link
                      href={`/certificates/${cert.certificateCode}`}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : displayedCourses.length === 0 ? (
        /* Empty Enrolled State */
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No enrolled courses</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Explore our project-first engineering courses and start learning today.
            </p>
          </div>
          <Button asChild className="rounded-lg">
            <Link href="/courses">
              <span>Browse Catalog</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      ) : (
        /* Courses Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((item) => {
            const resumeHref = `/learning/${item.course.slug || item.course.id}`;

            return (
              <Card
                key={item.enrollmentId}
                className="group flex flex-col justify-between overflow-hidden border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                    {item.course.thumbnailUrl && (
                      <img
                        src={item.course.thumbnailUrl}
                        alt={item.course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
                      {item.progress?.progressPercent ?? 0}% Completed
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.course.subtitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                        <span>Curriculum Progress</span>
                        <span>
                          {item.progress?.completedLessonsCount ?? 0} /{' '}
                          {item.progress?.totalLessonsCount ?? item.course.totalLessons} lessons
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.progress?.progressPercent ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-5 pt-0">
                  <Button asChild className="w-full rounded-lg">
                    <Link href={resumeHref} className="flex items-center justify-center gap-2">
                      <Play className="size-3.5 fill-current" />
                      <span>Continue Learning</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
