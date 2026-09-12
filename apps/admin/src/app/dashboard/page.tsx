'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Activity,
  Shield,
  CheckCircle2,
  UserPlus,
  ShieldPlus,
  KeyRound,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Server,
  Lock,
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
} from '@/components/ui/data-table';
import { adminStatsQueryOptions, adminUsersQueryOptions } from '@/lib/admin/users.queries';
import { rolesQueryOptions } from '@/lib/admin/roles.queries';
import { useAdminAnalytics } from '@/lib/admin/lms.queries';

export default function DashboardOverviewPage() {
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useQuery(adminStatsQueryOptions);

  const { data: usersData, isLoading: isUsersLoading } = useQuery(
    adminUsersQueryOptions({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
  );

  const { data: roles } = useQuery(rolesQueryOptions);
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
    isRefetching: isAnalyticsRefetching,
  } = useAdminAnalytics();

  const handleRefreshAll = () => {
    void refetchStats();
    void refetchAnalytics();
  };

  const verifiedPercent =
    stats && stats.users.total > 0
      ? Math.round((stats.users.verified / stats.users.total) * 100)
      : 0;

  const kpis = analytics?.kpis ?? {
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Console Overview</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time aggregate platform metrics, LMS revenue telemetry, and RBAC governance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            isLoading={isStatsRefetching || isAnalyticsRefetching}
            className="w-full sm:w-auto"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh Telemetry
          </Button>
          <Link href="/dashboard/courses/new" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              leftIcon={<BookOpen className="h-4 w-4" />}
            >
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: LMS Commerce KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={isAnalyticsLoading ? '...' : `₹${kpis.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          accentColor="emerald"
          trend={{
            value: 'Real-time',
            label: 'GMV',
            isPositive: true,
          }}
          description="Total settled course checkouts"
        />

        <StatCard
          title="Enrolled Learners"
          value={isAnalyticsLoading ? '...' : kpis.totalStudents.toLocaleString()}
          icon={<GraduationCap className="h-5 w-5" />}
          accentColor="indigo"
          trend={{
            value: `${kpis.totalEnrollments} enrollments`,
            label: 'active',
            isPositive: true,
          }}
          description="Students enrolled across courses"
        />

        <StatCard
          title="Courses in Catalog"
          value={isAnalyticsLoading ? '...' : `${kpis.publishedCourses} / ${kpis.totalCourses}`}
          icon={<BookOpen className="h-5 w-5" />}
          accentColor="purple"
          trend={{
            value: `${kpis.publishedCourses} Published`,
            label: 'ready',
            isNeutral: true,
          }}
          description="Catalog curriculum inventory"
        />

        <StatCard
          title="Completion Funnel"
          value={isAnalyticsLoading ? '...' : `${kpis.completionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="cyan"
          trend={{
            value: 'Platform average',
            label: 'rate',
            isPositive: kpis.completionRate >= 50,
          }}
          description="Average student curriculum progress"
        />
      </div>

      {/* Row 2: User Security & Platform Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={isStatsLoading ? '...' : (stats?.users.total ?? 0)}
          icon={<Users className="h-5 w-5" />}
          accentColor="indigo"
          trend={{
            value: `+${stats?.users.newThisWeek ?? 0} this week`,
            label: 'new',
            isPositive: true,
          }}
          description={`${stats?.users.active ?? 0} active, ${stats?.users.suspended ?? 0} suspended`}
        />

        <StatCard
          title="Active User Sessions"
          value={isStatsLoading ? '...' : (stats?.sessions.active ?? 0)}
          icon={<Activity className="h-5 w-5" />}
          accentColor="emerald"
          trend={{
            value: 'Real-time',
            label: 'sessions',
            isNeutral: true,
          }}
          description="Authenticated active sessions"
        />

        <StatCard
          title="Configured Roles"
          value={isStatsLoading ? '...' : (stats?.roles.total ?? roles?.length ?? 0)}
          icon={<Shield className="h-5 w-5" />}
          accentColor="purple"
          trend={{
            value: `${roles?.filter((r) => r.type === 'SYSTEM').length ?? 3} System`,
            label: 'system',
            isNeutral: true,
          }}
          description="RBAC access control definitions"
        />

        <StatCard
          title="Email Verification Rate"
          value={isStatsLoading ? '...' : `${verifiedPercent}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accentColor="cyan"
          trend={{
            value: `${stats?.users.verified ?? 0} verified`,
            label: 'verified',
            isPositive: verifiedPercent >= 50,
          }}
          description="Confirmed user email"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Signups */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/40">
              <div>
                <CardTitle>Recent User Registrations</CardTitle>
                <CardDescription>
                  Latest accounts registered on the StudyHub platform
                </CardDescription>
              </div>
              <Link
                href="/dashboard/users"
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
              >
                <span>View all directory</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table containerClassName="rounded-none border-0 bg-transparent shadow-none">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersLoading ? (
                    <TableSkeleton rows={5} cols={4} />
                  ) : usersData?.users && usersData.users.length > 0 ? (
                    usersData.users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              firstName={u.firstName}
                              lastName={u.lastName}
                              email={u.email}
                              size="sm"
                              isOnline={u._count.sessions > 0}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">
                                {u.firstName} {u.lastName || ''}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-mono truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.role.type === 'SYSTEM' ? 'system' : 'custom'} size="sm">
                            {u.role.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === 'ACTIVE'
                                ? 'active'
                                : u.status === 'SUSPENDED'
                                  ? 'suspended'
                                  : u.status === 'DELETED'
                                    ? 'deleted'
                                    : 'inactive'
                            }
                            size="sm"
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-[11px] font-mono text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-xs text-muted-foreground"
                      >
                        No registered users yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions & Security Posture */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle>Administration Hub</CardTitle>
              <CardDescription>Direct execution shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/dashboard/users" className="block">
                <div className="group flex items-center justify-between rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs transition-all hover:border-primary/40 hover:bg-secondary/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Manage Directory</p>
                      <p className="text-[10px] text-muted-foreground">
                        Add, edit, or suspend users
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/roles" className="block">
                <div className="group flex items-center justify-between rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs transition-all hover:border-purple-500/40 hover:bg-secondary/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldPlus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">RBAC Roles</p>
                      <p className="text-[10px] text-muted-foreground">
                        Define and assign permissions
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/permissions" className="block">
                <div className="group flex items-center justify-between rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs transition-all hover:border-cyan-500/40 hover:bg-secondary/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Permissions Matrix</p>
                      <p className="text-[10px] text-muted-foreground">
                        Inspect global system privileges
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Security & Health Card */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle>Platform Security</CardTitle>
              <CardDescription>Subsystem operational integrity</CardDescription>
            </CardHeader>
            <CardContent className=" text-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Argon2id Hashing</span>
                </div>
                <span className="font-mono text-emerald-400 font-medium text-[11px]">
                  Active (19MB)
                </span>
              </div>

              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">RBAC Redis Cache</span>
                </div>
                <span className="font-mono text-emerald-400 font-medium text-[11px]">
                  Synchronized
                </span>
              </div>

              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Token Rotation</span>
                </div>
                <span className="font-mono text-emerald-400 font-medium text-[11px]">Enforced</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
