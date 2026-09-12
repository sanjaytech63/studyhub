'use client';

import * as React from 'react';
import {
  UploadCloud,
  File as FileIcon,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Video,
  Play,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { uploadAdminMedia } from '@/services/admin-lms.service';
import { getApiErrorMessage } from '@/lib/api/api-client';
import { VideoPlayer } from '@/components/ui/video-player';

export interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  maxSizeBytes?: number; // default 20MB
  value?: string; // Existing URL
  onChange?: (url: string) => void;
  onUpload?: (file: File, onProgress: (percent: number) => void) => Promise<string>;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  label = 'Upload File',
  description = 'Drag and drop or browse to select a file',
  accept = 'image/*',
  maxSizeBytes,
  value,
  onChange,
  onUpload,
  disabled = false,
  className,
}: FileUploadProps) {
  const defaultMaxSizeBytes = accept.includes('video') ? 200 * 1024 * 1024 : 20 * 1024 * 1024;
  const effectiveMaxSizeBytes = maxSizeBytes ?? defaultMaxSizeBytes;

  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [internalPreviewUrl, setInternalPreviewUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showVideoPreview, setShowVideoPreview] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const previewUrl = internalPreviewUrl ?? (value || null);
  const setPreviewUrl = (url: string | null) => setInternalPreviewUrl(url);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    if (file.size > effectiveMaxSizeBytes) {
      setErrorMessage(
        `File exceeds maximum size limit of ${(effectiveMaxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`,
      );
      return false;
    }
    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setStatus('uploading');
    setProgress(5);

    try {
      let finalUrl = '';
      if (onUpload) {
        finalUrl = await onUpload(file, (p) => setProgress(p));
      } else {
        const res = await uploadAdminMedia(file, (p) => setProgress(p));
        finalUrl = res.url;
      }
      setStatus('success');
      setProgress(100);
      setPreviewUrl(finalUrl);
      onChange?.(finalUrl);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(getApiErrorMessage(err, 'Upload failed. Please try again.'));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      void processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProgress(0);
    setStatus('idle');
    setErrorMessage(null);
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      void processFile(selectedFile);
    }
  };

  const isImage =
    accept.includes('image') ||
    previewUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i) ||
    previewUrl?.includes('/image/upload/');
  const isVideo =
    accept.includes('video') ||
    previewUrl?.match(/\.(mp4|webm|ogg|mov|mkv|m4v)$/i) ||
    previewUrl?.includes('/video/upload/');

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="text-xs font-semibold text-foreground">{label}</label>}

      {previewUrl && status !== 'error' ? (
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3 sm:p-4 space-y-3">
          {/* Uploading State Banner */}
          {status === 'uploading' && (
            <div className="space-y-2 rounded-xl bg-muted/20 border border-border p-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground truncate pr-2">
                  {progress < 20
                    ? 'Connecting to Cloudinary CDN...'
                    : progress < 90
                      ? `Uploading (${progress}%)...`
                      : progress < 100
                        ? `Optimizing format (${progress}%)...`
                        : 'Finalizing...'}
                </span>
                <span className="font-bold text-foreground shrink-0">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Visual Media Preview */}
          {isImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/20">
              <img src={previewUrl} alt="Upload Preview" className="h-full w-full object-cover" />
              {status === 'success' && (
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-md border border-white/10">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Ready</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || status === 'uploading'}
                className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80 hover:text-white hover:bg-destructive backdrop-blur-md border border-white/10 transition-colors"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : isVideo ? (
            showVideoPreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-slate-950">
                <VideoPlayer
                  src={previewUrl}
                  title={selectedFile?.name || label || 'Video Preview'}
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div
                onClick={() => setShowVideoPreview(true)}
                className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </div>
                <span className="mt-2 text-xs font-semibold text-white/90 group-hover:text-primary transition-colors">
                  Click to Preview Video
                </span>
                {status === 'success' && (
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-md border border-white/10">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Ready</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={disabled || status === 'uploading'}
                  className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80 hover:text-white hover:bg-destructive backdrop-blur-md border border-white/10 transition-colors"
                  title="Remove video"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
              <FileIcon className="h-6 w-6 text-muted-foreground shrink-0" />
              <p className="text-xs font-semibold truncate flex-1">
                {selectedFile?.name || previewUrl}
              </p>
            </div>
          )}

          {/* Details & Actions Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-semibold text-foreground truncate"
                title={selectedFile ? selectedFile.name : previewUrl}
              >
                {selectedFile
                  ? selectedFile.name
                  : previewUrl.split('/').pop()?.split('?')[0] || 'Uploaded Media'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {selectedFile && (
                  <span className="font-mono">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
                {status === 'success' && (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isVideo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideoPreview((prev) => !prev)}
                  className="h-8 text-xs gap-1.5"
                >
                  {showVideoPreview ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  )}
                  <span>{showVideoPreview ? 'Close' : 'Watch'}</span>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || status === 'uploading'}
                className="h-8 text-xs"
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || status === 'uploading'}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border/80 bg-card hover:border-primary/50 hover:bg-muted/10',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />

          <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:scale-105 transition-transform">
            {accept.includes('video') ? (
              <Video className="h-6 w-6" />
            ) : accept.includes('image') ? (
              <FileImage className="h-6 w-6" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <h4 className="mt-3 text-xs font-bold text-foreground">{description}</h4>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Supported formats: {accept} up to {(effectiveMaxSizeBytes / (1024 * 1024)).toFixed(0)}MB
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 pointer-events-none"
            disabled={disabled}
          >
            Browse File
          </Button>
        </div>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{errorMessage}</span>
            {selectedFile && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1 font-semibold underline text-destructive hover:opacity-80"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
