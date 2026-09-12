'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  DollarSign,
  GraduationCap,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAdminAnalytics } from '@/lib/admin/lms.queries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/ui/data-table';

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, isError, refetch, isRefetching } = useAdminAnalytics();

  const kpis = analytics?.kpis ?? {
    totalStudents: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    completionRate: 0,
  };

  const topCourses = analytics?.topCourses ?? [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            LMS Analytics &amp; Executive KPIs
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Platform health metrics, gross merchandise value, completion funnels, and course
            performance.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          isLoading={isRefetching}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          className="w-full sm:w-auto"
        >
          Refresh Telemetry
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center space-y-3">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">
            Aggregating real-time platform telemetry...
          </p>
        </Card>
      ) : isError ? (
        <Card className="p-12 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="text-sm font-bold text-foreground">Unable to load telemetry</h3>
          <p className="text-xs text-muted-foreground">
            An error occurred while compiling platform analytics metrics.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Total Revenue (GMV)
                </span>
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                ₹{kpis.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                <TrendingUp className="h-3 w-3" />
                Real-time Gross Revenue
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Total Active Learners
                </span>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                {kpis.totalStudents.toLocaleString()}
              </p>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Verified platform accounts
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Course Completion Rate
                </span>
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                {kpis.completionRate}%
              </p>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Average across all enrolled courses
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Published Courses</span>
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                {kpis.publishedCourses} / {kpis.totalCourses}
              </p>
              <div className="mt-1 text-[11px] text-muted-foreground">Catalog availability</div>
            </Card>
          </div>

          {/* Top Performing Courses */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Top Performing Courses by Revenue
            </h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Gross Revenue</TableHead>
                  <TableHead className="text-right">Conversion Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCourses.length === 0 ? (
                  <TableEmpty
                    colSpan={5}
                    title="No course conversions yet"
                    description="As students enroll in courses, performance rankings by GMV will display here."
                  />
                ) : (
                  topCourses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-semibold text-foreground">{c.title}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{c.slug}</div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-foreground">
                        ₹{c.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-primary">
                        {c.enrollmentsCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-foreground">
                        ₹{c.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-emerald-500 font-semibold">
                        {Math.round((c.revenue / (kpis.totalRevenue || 1)) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
