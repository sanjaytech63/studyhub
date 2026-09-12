'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import {
  useAdminCourses,
  usePublishAdminCourseMutation,
  useDeleteAdminCourseMutation,
} from '@/lib/admin/lms.queries';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmModal } from '@/components/ui/confirm-modal';
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
import type { AdminCourse } from '@/services/admin-lms.service';
import { getApiErrorMessage } from '@/lib/api/api-client';

export default function AdminCoursesPage() {
  const { filters, updateFilters } = useUrlFilters<{
    search?: string;
    status?: string;
  }>();

  const search = filters.search || '';
  const statusFilter = filters.status || 'ALL';

  const [deleteCourseTarget, setDeleteCourseTarget] = useState<AdminCourse | null>(null);

  const {
    data: courses = [],
    isLoading,
    isRefetching,
    refetch,
  } = useAdminCourses({
    search: search.trim() || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  });

  const publishMutation = usePublishAdminCourseMutation();
  const deleteMutation = useDeleteAdminCourseMutation();

  const handlePublish = async (courseId: string) => {
    try {
      await publishMutation.mutateAsync(courseId);
      toast.success('Course published to public catalog successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to publish course.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCourseTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteCourseTarget.id);
      toast.success(`Course "${deleteCourseTarget.title}" deleted.`);
      setDeleteCourseTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to delete course.');
    }
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Courses Directory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage course curriculum, status, pricing, and publishing operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => void refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>

          <Link href="/dashboard/courses/new">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Create New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar / Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search courses by title or slug..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={(value) => updateFilters({ status: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Learners</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : filtered.length === 0 ? (
            <TableEmpty
              colSpan={6}
              title="No courses found"
              description={
                search || statusFilter !== 'ALL'
                  ? 'No courses match your filter criteria. Try clearing filters.'
                  : 'No courses created yet. Click Create New Course to get started.'
              }
            />
          ) : (
            filtered.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="min-w-0 max-w-sm">
                    <div className="font-semibold text-xs text-foreground truncate">
                      {course.title}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground truncate">
                      {course.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    {course.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    ₹{course.price.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  {course.status === 'PUBLISHED' ? (
                    <Badge variant="active" size="sm" className="gap-1 font-mono text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      PUBLISHED
                    </Badge>
                  ) : course.status === 'REVIEW' ? (
                    <Badge variant="suspended" size="sm" className="gap-1 font-mono text-[10px]">
                      <AlertCircle className="h-3 w-3" />
                      REVIEW
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm" className="gap-1 font-mono text-[10px]">
                      <AlertCircle className="h-3 w-3" />
                      {course.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                  {(course._count?.enrollments || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {course.status !== 'PUBLISHED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={
                          publishMutation.isPending && publishMutation.variables === course.id
                        }
                        onClick={() => handlePublish(course.id)}
                        className="text-xs h-7 text-emerald-500 hover:text-emerald-400"
                      >
                        Publish
                      </Button>
                    )}

                    <Link href={`/dashboard/courses/${course.id}/edit`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit course details and curriculum"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </Link>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteCourseTarget(course)}
                      title="Delete course"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {deleteCourseTarget && (
        <ConfirmModal
          isOpen={Boolean(deleteCourseTarget)}
          onClose={() => setDeleteCourseTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Course?"
          message={`Are you sure you want to delete "${deleteCourseTarget.title}"? All associated modules, lessons, and materials will be permanently removed.`}
          confirmText="Delete Course"
          isDestructive
        />
      )}
    </div>
  );
}
