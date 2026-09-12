'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  createAdminCourse,
  createAdminLesson,
  createAdminModule,
  publishAdminCourse,
} from '@/services/admin-lms.service';
import { useAdminCategories } from '@/lib/admin/lms.queries';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api/api-client';
import { createCourseSchema, type CreateCourseFormValues } from '@/lib/admin/courses.schema';

import {
  type CourseTab,
  type ModuleDraft,
  type LessonDraft,
  slugify,
  NewCourseHeader,
  NewCourseTabs,
  StepInfo,
  StepPricing,
  StepCurriculum,
  StepReview,
} from '../components';

export default function NewCourseBuilderPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<CourseTab>('info');
  const [modules, setModules] = useState<ModuleDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: categories = [], isLoading: isCategoriesLoading } = useAdminCategories();

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      outcomeDescription: '',
      level: 'INTERMEDIATE',
      categoryId: '',
      isFree: false,
      price: 0,
      thumbnailUrl: '',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;

  const title = useWatch({ control, name: 'title' });
  const slug = useWatch({ control, name: 'slug' });
  const level = useWatch({ control, name: 'level' });
  const isFree = useWatch({ control, name: 'isFree' });
  const price = useWatch({ control, name: 'price' });
  const thumbnailUrl = useWatch({ control, name: 'thumbnailUrl' });

  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalFreePreviews = modules.reduce(
    (total, module) => total + module.lessons.filter((lesson) => lesson.isFreePreview).length,
    0,
  );

  /**
   * Auto-select first category when categories are loaded.
   */
  useEffect(() => {
    if (categories.length > 0 && !getValues('categoryId')) {
      setValue('categoryId', categories[0].id, {
        shouldValidate: false,
      });
    }
  }, [categories, getValues, setValue]);

  /**
   * Generate slug from course title unless the administrator has manually changed the slug.
   */
  const handleTitleChange = (value: string) => {
    const currentTitle = getValues('title');
    const currentSlug = getValues('slug');
    const previousGeneratedSlug = slugify(currentTitle);

    setValue('title', value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!currentSlug || currentSlug === previousGeneratedSlug) {
      setValue('slug', slugify(value), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  /**
   * Add a new local curriculum module.
   */
  const addModule = () => {
    const newModule: ModuleDraft = {
      id: `m-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: [],
    };
    setModules((currentModules) => [...currentModules, newModule]);
  };

  /**
   * Remove a local curriculum module.
   */
  const removeModule = (moduleId: string) => {
    setModules((currentModules) => currentModules.filter((module) => module.id !== moduleId));
  };

  /**
   * Update module fields.
   */
  const updateModule = (moduleId: string, field: 'title' | 'description', value: string) => {
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              [field]: value,
            }
          : module,
      ),
    );
  };

  /**
   * Add a lesson to a module.
   */
  const addLesson = (moduleId: string) => {
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== moduleId) return module;

        const newLesson: LessonDraft = {
          id: `l-${Date.now()}`,
          title: `Lesson ${module.lessons.length + 1}`,
          type: 'VIDEO',
          durationMinutes: 15,
          isFreePreview: false,
        };

        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }),
    );
  };

  /**
   * Remove a lesson.
   */
  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }),
    );
  };

  /**
   * Update lesson fields.
   */
  const updateLesson = (moduleId: string, lessonId: string, patch: Partial<LessonDraft>) => {
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId
              ? {
                  ...lesson,
                  ...patch,
                }
              : lesson,
          ),
        };
      }),
    );
  };

  /**
   * Validate Course Details before moving to Pricing.
   */
  const handleNextFromInfo = async () => {
    const isValid = await trigger(['title', 'slug', 'level', 'categoryId']);
    if (isValid) {
      setActiveTab('pricing');
      return;
    }
    toast.error('Please complete the course details correctly.');
  };

  /**
   * Validate Pricing & Media before moving to Curriculum.
   */
  const handleNextFromPricing = async () => {
    const fieldsToValidate: Array<keyof CreateCourseFormValues> = ['price', 'thumbnailUrl'];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveTab('curriculum');
      return;
    }
    toast.error('Please complete the pricing and media details correctly.');
  };

  /**
   * Create course + modules + lessons.
   */
  const executeSave = async (data: CreateCourseFormValues, publishImmediate: boolean) => {
    if (saving) return;

    setSaving(true);
    setErrorMsg(null);

    try {
      const baseSlug = data.slug.trim() || slugify(data.title);
      const generatedSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // 1. Create course
      const course = await createAdminCourse({
        title: data.title.trim(),
        slug: generatedSlug,
        subtitle: data.subtitle?.trim() || undefined,
        description: data.description?.trim() || '',
        outcomeDescription: data.outcomeDescription?.trim() || undefined,
        level: data.level,
        price: data.isFree ? 0 : Number(data.price) || 0,
        categoryId: data.categoryId || undefined,
        instructorId: user?.id,
        thumbnailUrl: data.thumbnailUrl?.trim() || undefined,
      });

      // 2. Create modules and lessons sequentially
      if (course?.id && modules.length > 0) {
        for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex += 1) {
          const courseModule = modules[moduleIndex];

          const createdModule = await createAdminModule({
            courseId: course.id,
            title: courseModule.title.trim(),
            description: courseModule.description.trim() || undefined,
            orderIndex: moduleIndex,
          });

          if (createdModule?.id && courseModule.lessons.length > 0) {
            for (let lessonIndex = 0; lessonIndex < courseModule.lessons.length; lessonIndex += 1) {
              const lesson = courseModule.lessons[lessonIndex];

              await createAdminLesson({
                moduleId: createdModule.id,
                title: lesson.title.trim(),
                slug: `${slugify(lesson.title)}-${lessonIndex + 1}`,
                type: lesson.type,
                durationMinutes: lesson.durationMinutes,
                videoUrl: lesson.videoUrl || undefined,
                contentMarkdown: lesson.content || undefined,
                isFreePreview: lesson.isFreePreview,
                orderIndex: lessonIndex,
              });
            }
          }
        }
      }

      // 3. Publish if requested
      if (publishImmediate && course?.id) {
        await publishAdminCourse(course.id);
        toast.success('Course created and published successfully!');
      } else {
        toast.success('Course draft created successfully!');
      }

      router.push('/dashboard/courses');
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save course as draft.
   */
  const onSaveDraft = () => {
    handleSubmit(
      (data) => executeSave(data, false),
      (invalidErrors) => {
        const firstErrorKey = Object.keys(invalidErrors)[0];
        if (['title', 'slug', 'level', 'categoryId'].includes(firstErrorKey)) {
          setActiveTab('info');
        } else if (['price', 'thumbnailUrl'].includes(firstErrorKey)) {
          setActiveTab('pricing');
        }
        toast.error('Please complete all required fields correctly.');
      },
    )();
  };

  /**
   * Publish course.
   */
  const onPublishCourse = () => {
    handleSubmit(
      (data) => executeSave(data, true),
      (invalidErrors) => {
        const firstErrorKey = Object.keys(invalidErrors)[0];
        if (['title', 'slug', 'level', 'categoryId'].includes(firstErrorKey)) {
          setActiveTab('info');
        } else if (['price', 'thumbnailUrl'].includes(firstErrorKey)) {
          setActiveTab('pricing');
        }
        toast.error('Please complete all required fields correctly.');
      },
    )();
  };

  const selectedCategoryName = categories.find((c) => c.id === getValues('categoryId'))?.name;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar & Global Error */}
      <NewCourseHeader
        saving={saving}
        onSaveDraft={onSaveDraft}
        onPublishCourse={onPublishCourse}
        errorMsg={errorMsg}
      />

      {/* Course Steps Tabs */}
      <NewCourseTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLessons={totalLessons}
      />

      {/* Tab 1 — Course Information */}
      {activeTab === 'info' && (
        <StepInfo
          register={register}
          control={control}
          errors={errors}
          onTitleChange={handleTitleChange}
          onNext={handleNextFromInfo}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
        />
      )}

      {/* Tab 2 — Pricing & Media */}
      {activeTab === 'pricing' && (
        <StepPricing
          register={register}
          setValue={setValue}
          errors={errors}
          isFree={isFree}
          thumbnailUrl={thumbnailUrl}
          onBack={() => setActiveTab('info')}
          onNext={handleNextFromPricing}
        />
      )}

      {/* Tab 3 — Curriculum */}
      {activeTab === 'curriculum' && (
        <StepCurriculum
          modules={modules}
          onAddModule={addModule}
          onRemoveModule={removeModule}
          onUpdateModule={updateModule}
          onAddLesson={addLesson}
          onRemoveLesson={removeLesson}
          onUpdateLesson={updateLesson}
          onBack={() => setActiveTab('pricing')}
          onNext={() => setActiveTab('review')}
        />
      )}

      {/* Tab 4 — Review & Publish */}
      {activeTab === 'review' && (
        <StepReview
          title={title}
          slug={slug}
          isFree={isFree}
          price={Number(price || 0)}
          level={level}
          modulesCount={modules.length}
          totalLessons={totalLessons}
          totalFreePreviews={totalFreePreviews}
          categoryName={selectedCategoryName}
          saving={saving}
          onBack={() => setActiveTab('curriculum')}
          onPublish={onPublishCourse}
        />
      )}
    </div>
  );
}
