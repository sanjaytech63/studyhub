'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCourseBySlug } from '@/lib/courses/course.queries';
import {
  useValidateCoupon,
  useCreateOrder,
  useCreateCheckoutSession,
  useVerifyPayment,
} from '@/lib/learning/learning.queries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface AppliedCouponData {
  code: string;
  discountAmount: number;
  finalPrice: number;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.courseSlug as string) || '';

  const { data: course, isLoading, isError } = useCourseBySlug(slug);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponData | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateCouponMutation = useValidateCoupon();
  const createOrderMutation = useCreateOrder();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const verifyPaymentMutation = useVerifyPayment();

  const isProcessing =
    createOrderMutation.isPending ||
    createCheckoutSessionMutation.isPending ||
    verifyPaymentMutation.isPending;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !course) return;

    setCouponError(null);

    try {
      const res = await validateCouponMutation.mutateAsync({
        code: couponCode.trim(),
        courseId: course.id,
      });

      if (res.valid) {
        setAppliedCoupon(res);
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired coupon';
      setCouponError(msg);
    }
  };

  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : course ? course.price : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const handleCompleteEnrollment = async () => {
    if (!course) return;
    setErrorMessage(null);

    try {
      // 1. Create Order
      const order = await createOrderMutation.mutateAsync({
        courseId: course.id,
        couponCode: appliedCoupon?.code,
      });

      // 2. Create Checkout Session
      const session = await createCheckoutSessionMutation.mutateAsync({
        orderId: order.id,
      });

      if (session.isFree) {
        // Instant enrollment for free/100% discounted orders
        router.push(`/learning/${course.slug || course.id}`);
        return;
      }

      // 3. For paid orders, verify transaction
      const verifyRes = await verifyPaymentMutation.mutateAsync({
        orderId: order.id,
        providerPaymentId: `pay_${Date.now()}`,
        providerOrderId: session.orderNumber,
      });

      if (verifyRes.success) {
        router.push(`/learning/${course.slug || course.id}`);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.';
      setErrorMessage(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <div className="md:col-span-5">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Course Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          The course you requested for enrollment could not be loaded. Please return to the course
          catalog.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to course details</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Complete Your Enrollment
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review your order details and choose your preferred payment option below.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary & Coupon Input */}
          <div className="md:col-span-7 space-y-6">
            {/* Course Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex items-start gap-4">
              <div className="h-20 w-28 overflow-hidden rounded-lg bg-slate-900 shrink-0 relative border border-border/60">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/20" />
                )}
              </div>
              <div className="space-y-1">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {course.category?.name || 'Full Stack Course'}
                </span>
                <h3 className="text-sm font-bold text-foreground leading-snug">{course.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Lifetime Access · Certificate Included
                </p>
              </div>
            </div>

            {/* Coupon Code Input Box */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                Have a coupon or voucher?
              </h4>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-muted/40 px-3.5 py-2 text-xs text-foreground uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={validateCouponMutation.isPending || !couponCode.trim()}
                  className="rounded-lg bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                  {validateCouponMutation.isPending ? 'Validating...' : 'Apply'}
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500 border border-emerald-500/20">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Coupon &quot;{appliedCoupon.code}&quot; applied!
                  </span>
                  <span>-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                </div>
              )}

              {couponError && <p className="text-xs text-destructive font-medium">{couponError}</p>}
            </div>
          </div>

          {/* Right Column: Cost Breakdown & Payment Button */}
          <div className="md:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Original Price</span>
                <span>₹{course.price.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-border/60 pt-3 flex justify-between text-base font-extrabold text-foreground">
                <span>Total Amount</span>
                <span>₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteEnrollment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay ₹{finalPrice.toLocaleString()} &amp; Enroll</span>
                </>
              )}
            </button>

            <div className="text-center space-y-2 pt-2 text-[11px] text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                256-bit encrypted SSL checkout
              </p>
              <p>Instant enrollment. Automated invoice emailed after purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
