import Image from 'next/image';
import Link from 'next/link';

interface LearningCourseCardProps {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly progress: number;
  readonly imageUrl: string;
}

function normalizeProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
}

export function LearningCourseCard({
  id,
  title,
  category,
  progress,
  imageUrl,
}: LearningCourseCardProps) {
  const normalizedProgress = normalizeProgress(progress);

  return (
    <article className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/learning/${id}`} aria-label={`Continue learning ${title}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-primary">{category}</p>

          <h3 className="mt-1.5 line-clamp-2 font-semibold leading-6">
            <Link href={`/learning/${id}`} className="transition-colors hover:text-primary">
              {title}
            </Link>
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted-foreground">Progress</span>

            <span className="font-medium tabular-nums">{normalizedProgress}%</span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label={`${title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={normalizedProgress}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{
                width: `${normalizedProgress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
