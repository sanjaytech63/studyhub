'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminEnrollments,
  useAdminCourses,
  useGrantAdminEnrollmentMutation,
} from '@/lib/admin/lms.queries';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableEmpty,
} from '@/components/ui/data-table';
import { getApiErrorMessage } from '@/lib/api/api-client';

export default function AdminEnrollmentsPage() {
  const { filters, updateFilters } = useUrlFilters<{ search?: string }>();
  const search = filters.search || '';

  const {
    data: enrollments = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAdminEnrollments();

  const { data: courses = [] } = useAdminCourses();
  const grantMutation = useGrantAdminEnrollmentMutation();

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const grantCourseId = selectedCourseId || courses[0]?.id || '';

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim() || !grantCourseId) {
      toast.error('Please enter student email and select a course.');
      return;
    }

    try {
      await grantMutation.mutateAsync({
        userId: grantEmail.trim(),
        courseId: grantCourseId,
      });
      toast.success('Course access granted successfully.');
      setShowGrantModal(false);
      setGrantEmail('');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const filtered = enrollments.filter(
    (e) =>
      e.user.email.toLowerCase().includes(search.toLowerCase()) ||
      e.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      e.course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Student Enrollments
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor active students, course progression, and manually grant or revoke course access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGrantModal(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Grant Access
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search by student email, name, or course..."
            value={search}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      {isError ? (
        <Card className="p-10 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="text-sm font-bold text-foreground">Failed to load enrollments</h3>
          <p className="text-xs text-muted-foreground">
            An error occurred while connecting to the enrollment service.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Enrolled Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : filtered.length === 0 ? (
              <TableEmpty
                colSpan={4}
                title="No enrollments found"
                description={
                  search
                    ? `No enrollments match query "${search}".`
                    : 'Students who enroll in courses will be listed here.'
                }
              />
            ) : (
              filtered.map((enr) => (
                <TableRow key={enr.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {enr.user.firstName} {enr.user.lastName ?? ''}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {enr.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{enr.course.title}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {enr.course.slug}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {new Date(enr.enrolledAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {enr.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        COMPLETED
                      </span>
                    ) : enr.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-500 border border-amber-500/20">
                        <AlertCircle className="h-3 w-3" />
                        {enr.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Grant Access Modal */}
      <Modal
        isOpen={showGrantModal}
        onClose={() => setShowGrantModal(false)}
        title="Grant Manual Course Access"
        description="Immediately assign full course entitlement and unlock the course player for a student."
      >
        <form onSubmit={handleGrant} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Student Email or User ID *
            </label>
            <Input
              type="text"
              required
              placeholder="student@example.com or user UUID"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Course *</label>
            <NativeSelect
              value={grantCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
              {courses.length === 0 && <option value="">No courses available</option>}
            </NativeSelect>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGrantModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={grantMutation.isPending}>
              Grant Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
