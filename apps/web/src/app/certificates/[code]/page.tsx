'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle2, Download, Share2, ChevronLeft, AlertCircle } from 'lucide-react';
import { useVerifyCertificate } from '@/lib/learning/learning.queries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CertificatePage() {
  const params = useParams();
  const code = (params?.code as string) || '';

  const { data: cert, isLoading, isError, refetch } = useVerifyCertificate(code);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-36" />
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-6">
          <Skeleton className="size-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
          <Skeleton className="h-20 w-full max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (isError || !cert) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Certificate Verification Failed</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          The credential code{' '}
          <span className="font-mono text-foreground font-semibold">{code}</span> could not be
          verified in our registry. Please check the credential identifier or contact support.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
          <Button asChild>
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to student dashboard</span>
        </Link>

        {/* Certificate Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-background p-8 sm:p-12 shadow-2xl space-y-8 text-center">
          <div className="flex items-center justify-between border-b border-border/60 pb-6 text-xs text-muted-foreground">
            <span className="font-mono font-bold tracking-widest text-primary">
              STUDYHUB VERIFIED
            </span>
            <span className="font-mono">ID: {cert.certificateCode}</span>
          </div>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border-2 border-primary/30 shadow-lg">
            <Award className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Certificate of Completion
            </p>
            <p className="text-xs text-muted-foreground">This is proudly presented to</p>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {cert.student?.name || 'Verified Student'}
            </h1>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <p className="text-xs text-muted-foreground">
              for successfully mastering and completing all modules, projects, and architecture
              assessments in
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-primary">
              {cert.course?.title || 'Engineering Mastery'}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-6 text-xs text-left max-w-md mx-auto">
            <div>
              <p className="text-muted-foreground">Instructor</p>
              <p className="font-semibold text-foreground">
                {cert.course?.instructorName || 'StudyHub Lead Architect'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Date Issued</p>
              <p className="font-semibold text-foreground">
                {new Date(cert.issueDate).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Cryptographically Verified &amp; Permanent
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg"
          >
            <Download className="h-4 w-4" />
            <span>Download Certificate (PDF)</span>
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto rounded-lg">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                typeof window !== 'undefined'
                  ? window.location.href
                  : 'https://studyhubonline.store',
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share on LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
