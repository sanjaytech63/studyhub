'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/common/file-upload';

interface CourseMediaCardProps {
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  trailerVideoUrl: string;
  setTrailerVideoUrl: (url: string) => void;
}

export function CourseMediaCard({
  thumbnailUrl,
  setThumbnailUrl,
  trailerVideoUrl,
  setTrailerVideoUrl,
}: CourseMediaCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm">Media &amp; Assets</CardTitle>
            <CardDescription className="text-xs">
              Cloudinary CDN video preview and promotional cards.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <FileUpload
          label="Course Thumbnail Image"
          description="High-resolution banner card (16:9 recommended, max 10MB)"
          accept="image/*"
          value={thumbnailUrl}
          onChange={(url) => setThumbnailUrl(url)}
        />

        <FileUpload
          label="Trailer / Preview Video"
          description="Public intro trailer or promo clip (MP4, WEBM, MOV, max 200MB)"
          accept="video/*"
          maxSizeBytes={200 * 1024 * 1024}
          value={trailerVideoUrl}
          onChange={(url) => setTrailerVideoUrl(url)}
        />
      </CardContent>
    </Card>
  );
}
