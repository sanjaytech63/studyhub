'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  AlertCircle,
  RefreshCw,
  X,
  GraduationCap,
  Sparkles,
  Eye,
  Quote,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAdminReviews, useModerateAdminReviewMutation } from '@/lib/admin/lms.queries';
import type { AdminReview } from '@/services/admin-lms.service';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { getApiErrorMessage } from '@/lib/api/api-client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import { Modal } from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminReviewsPage() {
  const { filters, updateFilters } = useUrlFilters<{
    search?: string;
    status?: string;
    rating?: string;
  }>();

  const search = filters.search || '';
  const statusFilter = filters.status || 'ALL';
  const ratingFilter = filters.rating || 'ALL';

  const { data: reviews = [], isLoading, isError, refetch, isRefetching } = useAdminReviews();
  const moderateMutation = useModerateAdminReviewMutation();

  // Track currently moderating review ID to avoid global button spin
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [inspectReview, setInspectReview] = useState<AdminReview | null>(null);

  // Moderate action
  const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    setModeratingId(reviewId);
    try {
      await moderateMutation.mutateAsync({ reviewId, status });
      toast.success(
        status === 'APPROVED'
          ? 'Review approved and published to public catalog.'
          : 'Review rejected and hidden from public catalog.',
      );
      if (inspectReview?.id === reviewId) {
        setInspectReview((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setModeratingId(null);
    }
  };

  // Filtered dataset
  const filtered = useMemo(() => {
    return reviews.filter((rev) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        rev.user.email.toLowerCase().includes(q) ||
        rev.user.firstName.toLowerCase().includes(q) ||
        `${rev.user.firstName} ${rev.user.lastName || ''}`.toLowerCase().includes(q) ||
        rev.course.title.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q) ||
        (rev.title && rev.title.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || rev.status === statusFilter;

      let matchesRating = true;
      if (ratingFilter === '5') matchesRating = rev.rating === 5;
      else if (ratingFilter === '4') matchesRating = rev.rating === 4;
      else if (ratingFilter === '3') matchesRating = rev.rating <= 3;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  // Executive KPI computations
  const approvedReviews = useMemo(() => reviews.filter((r) => r.status === 'APPROVED'), [reviews]);
  const pendingReviews = useMemo(() => reviews.filter((r) => r.status === 'PENDING'), [reviews]);
  const rejectedReviews = useMemo(() => reviews.filter((r) => r.status === 'REJECTED'), [reviews]);

  const averageRating = useMemo(() => {
    if (approvedReviews.length === 0) return '5.0';
    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  const fiveStarCount = useMemo(() => {
    return approvedReviews.filter((r) => r.rating === 5).length;
  }, [approvedReviews]);

  const approvalRate = useMemo(() => {
    if (reviews.length === 0) return '100.0';
    return ((approvedReviews.length / reviews.length) * 100).toFixed(1);
  }, [approvedReviews.length, reviews.length]);

  // Status badge renderer
  const renderStatusBadge = (status: AdminReview['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="active" size="sm" className="font-mono">
            APPROVED
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="suspended" size="sm" className="font-mono">
            PENDING REVIEW
          </Badge>
        );
      case 'REJECTED':
      case 'FLAGGED':
        return (
          <Badge variant="deleted" size="sm" className="font-mono">
            REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm" className="font-mono">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
            <MessageSquare className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Review Moderation
              </h1>
              <Badge variant="outline" size="sm" withDot={false} className="font-mono">
                {reviews.length} submitted
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Screen student sentiment, curate public landing page social proof, and filter spam.
            </p>
          </div>
        </div>

        {/* Refresh Action */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            isLoading={isRefetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh Reviews
          </Button>
        </div>
      </div>

      {/* ============================================================
          EXECUTIVE METRICS RIBBON (StatCard System)
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="AVERAGE SATISFACTION"
          value={`${averageRating} / 5.0`}
          icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
          accentColor="amber"
          trend={{
            value: `${fiveStarCount} 5★ ratings`,
            label: 'high satisfaction',
            isPositive: true,
          }}
          description="Average score across all approved testimonials"
        />

        <StatCard
          title="APPROVED SOCIAL PROOF"
          value={approvedReviews.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accentColor="emerald"
          trend={{
            value: `${approvalRate}%`,
            label: 'approval rate',
            isPositive: true,
          }}
          description="Live on student catalog and course landing pages"
        />

        <StatCard
          title="MODERATION QUEUE"
          value={pendingReviews.length}
          icon={<Clock className="h-5 w-5" />}
          accentColor="indigo"
          trend={{
            value: pendingReviews.length === 0 ? 'Queue Clean' : `${pendingReviews.length} pending`,
            label: 'action required',
            isPositive: pendingReviews.length === 0,
          }}
          description="Awaiting administrator verification and publish"
        />

        <StatCard
          title="FLAGGED & REJECTED"
          value={rejectedReviews.length}
          icon={<AlertCircle className="h-5 w-5" />}
          accentColor="purple"
          trend={{
            value: `${rejectedReviews.length} filtered`,
            label: 'spam / violations',
            isNeutral: true,
          }}
          description="Offensive, low-effort, or policy-violating reviews"
        />
      </div>

      {/* ============================================================
          FILTER & CONTROL SUITE
      ============================================================ */}
      <Card className="p-4 shadow-xs border-border/80">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by student name, email, course title, or text..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value || undefined })}
              className="pl-10 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => updateFilters({ search: undefined })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'ALL', label: 'All Reviews', count: reviews.length },
              {
                id: 'PENDING',
                label: 'Pending',
                count: pendingReviews.length,
                color: 'text-amber-500',
              },
              {
                id: 'APPROVED',
                label: 'Approved',
                count: approvedReviews.length,
                color: 'text-emerald-500',
              },
              {
                id: 'REJECTED',
                label: 'Rejected',
                count: rejectedReviews.length,
                color: 'text-rose-500',
              },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      status: tab.id === 'ALL' ? undefined : tab.id,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                  }`}
                >
                  {tab.color && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${tab.color.replace('text-', 'bg-')}`}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Star Rating Select Dropdown */}
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={ratingFilter}
              onValueChange={(val) =>
                updateFilters({
                  rating: val === 'ALL' ? undefined : val,
                })
              }
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="All Star Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Star Ratings</SelectItem>
                <SelectItem value="5">★★★★★ (5 Stars)</SelectItem>
                <SelectItem value="4">★★★★☆ (4 Stars)</SelectItem>
                <SelectItem value="3">★★★☆☆ (3 Stars or Below)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Metrics Sub-strip */}
        {(search || statusFilter !== 'ALL' || ratingFilter !== 'ALL') && (
          <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                Showing <strong className="text-foreground">{filtered.length}</strong> of{' '}
                <strong className="text-foreground">{reviews.length}</strong> reviews
              </span>
              {statusFilter !== 'ALL' && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Status: {statusFilter}
                </Badge>
              )}
              {ratingFilter !== 'ALL' && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Rating: {ratingFilter}★
                </Badge>
              )}
              {search && (
                <Badge variant="outline" size="sm" withDot={false}>
                  Query: &ldquo;{search}&rdquo;
                </Badge>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                updateFilters({ search: undefined, status: undefined, rating: undefined })
              }
              className="text-primary hover:underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Card>

      {/* ============================================================
          REVIEWS FEED
      ============================================================ */}
      {isLoading ? (
        <Card className="p-12 text-center space-y-3 shadow-xs">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">Loading reviews for moderation...</p>
        </Card>
      ) : isError ? (
        <Card className="p-12 text-center space-y-4 border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-9 text-destructive mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Failed to connect to review service
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Could not fetch student reviews from the backend moderation system.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Retry Connection
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center space-y-4 shadow-xs border-dashed">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-muted/30 text-muted-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No reviews match your filters</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search || statusFilter !== 'ALL' || ratingFilter !== 'ALL'
                ? 'Try refining your query or changing the filter criteria.'
                : 'Student course reviews and ratings will populate here as learners complete courses.'}
            </p>
          </div>
          {(search || statusFilter !== 'ALL' || ratingFilter !== 'ALL') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateFilters({ search: undefined, status: undefined, rating: undefined })
              }
            >
              Clear All Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((rev) => {
            const isModeratingThis = moderatingId === rev.id;

            return (
              <Card
                key={rev.id}
                className="p-5 space-y-4 transition-all hover:shadow-md hover:border-border/90 group"
              >
                {/* Header row: Author + Course + Rating + Status + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      firstName={rev.user.firstName}
                      lastName={rev.user.lastName}
                      email={rev.user.email}
                      size="sm"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {rev.user.firstName} {rev.user.lastName ?? ''}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground truncate">
                          {rev.user.email}
                        </span>
                        <span className="text-xs text-muted-foreground/50 hidden sm:inline">
                          &bull;
                        </span>
                        <div className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <GraduationCap className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-xs">{rev.course.title}</span>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-muted text-muted-foreground/30'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-[11px] font-bold text-foreground font-mono">
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    {renderStatusBadge(rev.status)}

                    <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-2">
                  {rev.title && <h4 className="text-xs font-bold text-foreground">{rev.title}</h4>}

                  <div className="relative rounded-xl bg-muted/20 border border-border/40 p-3.5">
                    <Quote className="h-4 w-4 text-primary/30 absolute top-3 left-3 -scale-x-100" />
                    <p className="text-xs text-foreground/90 leading-relaxed pl-5 font-sans">
                      {rev.comment}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInspectReview(rev)}
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Preview Card
                  </Button>

                  <div className="flex items-center gap-2">
                    {rev.status !== 'REJECTED' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isModeratingThis}
                        isLoading={
                          isModeratingThis && moderateMutation.variables?.status === 'REJECTED'
                        }
                        onClick={() => handleModerate(rev.id, 'REJECTED')}
                        leftIcon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
                        className="text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                      >
                        Reject
                      </Button>
                    )}

                    {rev.status !== 'APPROVED' && (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={isModeratingThis}
                        isLoading={
                          isModeratingThis && moderateMutation.variables?.status === 'APPROVED'
                        }
                        onClick={() => handleModerate(rev.id, 'APPROVED')}
                        leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ============================================================
          INTERACTIVE TESTIMONIAL PREVIEW MODAL
      ============================================================ */}
      {inspectReview && (
        <Modal
          isOpen={Boolean(inspectReview)}
          onClose={() => setInspectReview(null)}
          title="Student Testimonial Card Preview"
          description="How this review displays to prospective students on the public course page."
          maxWidth="lg"
        >
          <div className="space-y-6 pt-2">
            {/* Public Card Mockup */}
            <div className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 to-transparent p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={inspectReview.user.firstName}
                    lastName={inspectReview.user.lastName}
                    email={inspectReview.user.email}
                    size="md"
                  />
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {inspectReview.user.firstName} {inspectReview.user.lastName ?? ''}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                      {inspectReview.course.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    {inspectReview.rating}.0
                  </span>
                </div>
              </div>

              {inspectReview.title && (
                <h3 className="text-sm font-bold text-foreground">{inspectReview.title}</h3>
              )}

              <p className="text-xs text-foreground/90 leading-relaxed italic">
                &ldquo;{inspectReview.comment}&rdquo;
              </p>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-2 border-t border-border/40">
                <span>Verified Course Student</span>
                <span>
                  {new Date(inspectReview.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Moderation Actions Inside Modal */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Current Status:</span>
                {renderStatusBadge(inspectReview.status)}
              </div>

              <div className="flex items-center gap-2">
                {inspectReview.status !== 'REJECTED' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={moderatingId === inspectReview.id}
                    onClick={() => handleModerate(inspectReview.id, 'REJECTED')}
                    leftIcon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Reject Review
                  </Button>
                )}

                {inspectReview.status !== 'APPROVED' && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={moderatingId === inspectReview.id}
                    onClick={() => handleModerate(inspectReview.id, 'APPROVED')}
                    leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  >
                    Approve &amp; Publish
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => setInspectReview(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
