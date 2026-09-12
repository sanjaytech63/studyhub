'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminCategories,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
} from '@/lib/admin/lms.queries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
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
import { getApiErrorMessage } from '@/lib/api/api-client';
import type { AdminCategory } from '@/services/admin-lms.service';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isRefetching, refetch } = useAdminCategories();
  const createMutation = useCreateAdminCategoryMutation();
  const updateMutation = useUpdateAdminCategoryMutation();
  const deleteMutation = useDeleteAdminCategoryMutation();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required.');
      return;
    }
    const finalSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: name.trim(),
            slug: finalSlug,
            description: description.trim() || undefined,
          },
        });
        toast.success(`Category "${name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim() || undefined,
        });
        toast.success(`Category "${name}" created successfully.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Category "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const query = search.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query)),
    );
  }, [categories, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-primary" />
            Course Categories
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Taxonomy classification and discovery tags for StudyHub courses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Categories Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>URL Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Active Courses</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : filteredCategories.length === 0 ? (
            <TableEmpty
              colSpan={5}
              title="No categories found"
              description={
                search
                  ? `No categories match query "${search}".`
                  : 'No course categories created yet. Add one to categorize courses.'
              }
            />
          ) : (
            filteredCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                      <FolderTree className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{cat.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                    {cat.slug}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs text-xs text-muted-foreground truncate">
                  {cat.description || '—'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="neutral" size="sm" className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{cat._count?.courses ?? 0}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(cat)}
                      title="Edit category"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(cat)}
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Course Category'}
        description={
          editingCategory
            ? `Update taxonomy details for "${editingCategory.name}".`
            : 'Add a new topic classification to group related courses.'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Category Name *</label>
            <Input
              type="text"
              required
              placeholder="e.g. Backend Engineering"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">URL Slug *</label>
            <Input
              type="text"
              required
              placeholder="backend-engineering"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <Textarea
              rows={3}
              placeholder="Brief summary of skills and courses in this domain..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitting}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Category"
        isDestructive
      />
    </div>
  );
}
