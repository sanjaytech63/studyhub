'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  useAdminCourse,
  useAdminCategories,
  useUpdateAdminCourseMutation,
  usePublishAdminCourseMutation,
  useCreateAdminModuleMutation,
  useCreateAdminLessonMutation,
  useDeleteAdminModuleMutation,
  useDeleteAdminLessonMutation,
} from '@/lib/admin/lms.queries';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { getApiErrorMessage } from '@/lib/api/api-client';

import {
  CourseEditSkeleton,
  CourseHeaderBar,
  CourseOverviewForm,
  CourseCurriculumSection,
  CourseStatusCard,
  CourseMediaCard,
  CourseChecklistCard,
  AddModuleModal,
  AddLessonModal,
} from '../../components';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params?.id as string;

  const { data: course, isLoading, refetch } = useAdminCourse(courseId);
  const { data: categories = [], isLoading: isCategoriesLoading } = useAdminCategories();

  const updateMutation = useUpdateAdminCourseMutation();
  const publishMutation = usePublishAdminCourseMutation();
  const createModuleMutation = useCreateAdminModuleMutation();
  const deleteModuleMutation = useDeleteAdminModuleMutation();
  const createLessonMutation = useCreateAdminLessonMutation();
  const deleteLessonMutation = useDeleteAdminLessonMutation();

  // Course Form State - Track if user modified fields or fallback to loaded course
  const [formFields, setFormFields] = useState<{
    title?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    outcomeDescription?: string;
    level?: string;
    categoryId?: string;
    price?: string;
    thumbnailUrl?: string;
    trailerVideoUrl?: string;
  }>({});

  const title = formFields.title ?? (course?.title || '');
  const setTitle = (val: string) => setFormFields((prev) => ({ ...prev, title: val }));

  const slug = formFields.slug ?? (course?.slug || '');
  const setSlug = (val: string) => setFormFields((prev) => ({ ...prev, slug: val }));

  const subtitle = formFields.subtitle ?? (course?.subtitle || '');
  const setSubtitle = (val: string) => setFormFields((prev) => ({ ...prev, subtitle: val }));

  const description = formFields.description ?? (course?.description || '');
  const setDescription = (val: string) => setFormFields((prev) => ({ ...prev, description: val }));

  const outcomeDescription = formFields.outcomeDescription ?? (course?.outcomeDescription || '');
  const setOutcomeDescription = (val: string) =>
    setFormFields((prev) => ({ ...prev, outcomeDescription: val }));

  const level = formFields.level ?? (course?.level || 'INTERMEDIATE');
  const setLevel = (val: string) => setFormFields((prev) => ({ ...prev, level: val }));

  const categoryId = formFields.categoryId ?? (course?.categoryId || '');
  const setCategoryId = (val: string) => setFormFields((prev) => ({ ...prev, categoryId: val }));

  const price = formFields.price ?? String(course?.price ?? 0);
  const setPrice = (val: string) => setFormFields((prev) => ({ ...prev, price: val }));

  const thumbnailUrl = formFields.thumbnailUrl ?? (course?.thumbnailUrl || '');
  const setThumbnailUrl = (val: string) =>
    setFormFields((prev) => ({ ...prev, thumbnailUrl: val }));

  const trailerVideoUrl = formFields.trailerVideoUrl ?? (course?.trailerVideoUrl || '');
  const setTrailerVideoUrl = (val: string) =>
    setFormFields((prev) => ({ ...prev, trailerVideoUrl: val }));

  const [saving, setSaving] = useState(false);

  // Module Modal State
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  // Lesson Modal State
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSlug, setLessonSlug] = useState('');
  const [lessonType, setLessonType] = useState<'VIDEO' | 'ARTICLE'>('VIDEO');
  const [lessonDuration, setLessonDuration] = useState('10');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonContentMarkdown, setLessonContentMarkdown] = useState('');
  const [lessonIsFreePreview, setLessonIsFreePreview] = useState(false);

  // Delete Confirm State
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'module' | 'lesson';
    id: string;
    title: string;
  } | null>(null);

  // Derived Curriculum Statistics
  const modules = useMemo(() => course?.modules || [], [course]);
  const totalLessonsCount = useMemo(
    () => modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0),
    [modules],
  );
  const totalDurationMinutes = useMemo(
    () =>
      modules.reduce(
        (acc, mod) =>
          acc + (mod.lessons?.reduce((lAcc, l) => lAcc + (l.durationMinutes || 0), 0) || 0),
        0,
      ),
    [modules],
  );

  const formattedDuration = useMemo(() => {
    const hours = Math.floor(totalDurationMinutes / 60);
    const mins = totalDurationMinutes % 60;
    if (hours === 0) return `${mins} mins`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, [totalDurationMinutes]);

  // Dirty State Checker
  const isFormDirty = useMemo(() => {
    if (!course) return false;
    return (
      title !== (course.title || '') ||
      slug !== (course.slug || '') ||
      subtitle !== (course.subtitle || '') ||
      description !== (course.description || '') ||
      outcomeDescription !== (course.outcomeDescription || '') ||
      level !== (course.level || 'INTERMEDIATE') ||
      categoryId !== (course.categoryId || '') ||
      Number(price) !== Number(course.price ?? 0) ||
      thumbnailUrl !== (course.thumbnailUrl || '') ||
      trailerVideoUrl !== (course.trailerVideoUrl || '')
    );
  }, [
    course,
    title,
    slug,
    subtitle,
    description,
    outcomeDescription,
    level,
    categoryId,
    price,
    thumbnailUrl,
    trailerVideoUrl,
  ]);

  // Handle Main Course Save
  const handleSave = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!title.trim()) {
        toast.error('Course title is required.');
        return;
      }

      setSaving(true);
      try {
        await updateMutation.mutateAsync({
          id: courseId,
          data: {
            title: title.trim(),
            slug: slug.trim() || undefined,
            subtitle: subtitle.trim() || undefined,
            description: description.trim() || undefined,
            outcomeDescription: outcomeDescription.trim() || undefined,
            level,
            price: Math.max(0, Number(price) || 0),
            categoryId: categoryId || undefined,
            thumbnailUrl: thumbnailUrl.trim() || undefined,
            trailerVideoUrl: trailerVideoUrl.trim() || undefined,
          },
        });
        toast.success('Course details updated successfully.');
        void refetch();
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setSaving(false);
      }
    },
    [
      courseId,
      title,
      slug,
      subtitle,
      description,
      outcomeDescription,
      level,
      price,
      categoryId,
      thumbnailUrl,
      trailerVideoUrl,
      updateMutation,
      refetch,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(courseId);
      toast.success('Course published to student catalog successfully.');
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) {
      toast.error('Module title is required.');
      return;
    }

    try {
      await createModuleMutation.mutateAsync({
        courseId,
        title: moduleTitle.trim(),
        description: moduleDescription.trim() || undefined,
        orderIndex: (course?.modules?.length || 0) + 1,
      });
      toast.success('Module added successfully.');
      setIsAddModuleOpen(false);
      setModuleTitle('');
      setModuleDescription('');
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleOpenAddLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setLessonTitle('');
    setLessonSlug('');
    setLessonType('VIDEO');
    setLessonDuration('10');
    setLessonVideoUrl('');
    setLessonContentMarkdown('');
    setLessonIsFreePreview(false);
    setIsAddLessonOpen(true);
  };

  const handleLessonTitleChange = (val: string) => {
    setLessonTitle(val);
    setLessonSlug(slugify(val));
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !lessonTitle.trim()) {
      toast.error('Lesson title is required.');
      return;
    }

    try {
      await createLessonMutation.mutateAsync({
        moduleId: selectedModuleId,
        title: lessonTitle.trim(),
        slug: lessonSlug.trim() || slugify(lessonTitle.trim()),
        type: lessonType,
        durationMinutes: Math.max(1, Number(lessonDuration) || 5),
        videoUrl: lessonType === 'VIDEO' ? lessonVideoUrl.trim() || undefined : undefined,
        contentMarkdown:
          lessonType === 'ARTICLE' ? lessonContentMarkdown.trim() || undefined : undefined,
        isFreePreview: lessonIsFreePreview,
      });
      toast.success('Lesson created successfully.');
      setIsAddLessonOpen(false);
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'module') {
        await deleteModuleMutation.mutateAsync(itemToDelete.id);
        toast.success(`Module "${itemToDelete.title}" deleted.`);
      } else {
        await deleteLessonMutation.mutateAsync(itemToDelete.id);
        toast.success(`Lesson "${itemToDelete.title}" deleted.`);
      }
      setItemToDelete(null);
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  // Loading State
  if (isLoading) {
    return <CourseEditSkeleton />;
  }

  // Not Found State
  if (!course) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <EmptyState
          icon={<AlertCircle className="size-6 text-destructive" />}
          title="Course Not Found"
          message="The requested course could not be located in your organization workspace. It may have been permanently removed."
          actionLabel="Back to Courses"
          actionHref="/dashboard/courses"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Top App Bar & Header */}
      <CourseHeaderBar
        courseTitle={course.title}
        courseSlug={course.slug}
        courseId={course.id}
        status={course.status}
        isFormDirty={isFormDirty}
        isSaving={saving}
        isPublishing={publishMutation.isPending}
        onSave={() => void handleSave()}
        onPublish={handlePublish}
      />

      {/* Main Studio Grid: 8 cols Editor, 4 cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Metadata & Curriculum */}
        <div className="lg:col-span-8 space-y-8">
          <CourseOverviewForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            onGenerateSlug={() => setSlug(slugify(title))}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            level={level}
            setLevel={setLevel}
            price={price}
            setPrice={setPrice}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            description={description}
            setDescription={setDescription}
            outcomeDescription={outcomeDescription}
            setOutcomeDescription={setOutcomeDescription}
          />

          <CourseCurriculumSection
            modules={modules}
            onOpenAddModule={() => setIsAddModuleOpen(true)}
            onOpenAddLesson={handleOpenAddLesson}
            onRequestDelete={(target) => setItemToDelete(target)}
          />
        </div>

        {/* Right Sidebar Column (4 cols): Media, Commerce & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <CourseStatusCard
            status={course.status}
            modulesCount={modules.length}
            lessonsCount={totalLessonsCount}
            formattedDuration={formattedDuration}
            onPublish={handlePublish}
            isPublishing={publishMutation.isPending}
          />

          <CourseMediaCard
            thumbnailUrl={thumbnailUrl}
            setThumbnailUrl={setThumbnailUrl}
            trailerVideoUrl={trailerVideoUrl}
            setTrailerVideoUrl={setTrailerVideoUrl}
          />

          <CourseChecklistCard
            title={title}
            thumbnailUrl={thumbnailUrl}
            modulesCount={modules.length}
            lessonsCount={totalLessonsCount}
          />
        </div>
      </div>

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onSubmit={handleCreateModule}
        title={moduleTitle}
        setTitle={setModuleTitle}
        description={moduleDescription}
        setDescription={setModuleDescription}
        isSubmitting={createModuleMutation.isPending}
      />

      {/* Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        onSubmit={handleCreateLesson}
        title={lessonTitle}
        onTitleChange={handleLessonTitleChange}
        slug={lessonSlug}
        setSlug={setLessonSlug}
        type={lessonType}
        setType={setLessonType}
        duration={lessonDuration}
        setDuration={setLessonDuration}
        videoUrl={lessonVideoUrl}
        setVideoUrl={setLessonVideoUrl}
        contentMarkdown={lessonContentMarkdown}
        setContentMarkdown={setLessonContentMarkdown}
        isFreePreview={lessonIsFreePreview}
        setIsFreePreview={setLessonIsFreePreview}
        isSubmitting={createLessonMutation.isPending}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={itemToDelete?.type === 'module' ? 'Delete Module' : 'Delete Lesson'}
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        isLoading={deleteModuleMutation.isPending || deleteLessonMutation.isPending}
        isDestructive
      />
    </div>
  );
}
