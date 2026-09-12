import crypto from 'node:crypto';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { prisma, PaymentStatus, PaymentProvider } from '@studyhub/database';
import * as orderRepo from '../orders/order.repository';
import * as paymentRepo from './payment.repository';
import * as enrollmentRepo from '../enrollments/enrollment.repository';
import * as couponRepo from '../coupons/coupon.repository';

export const createCheckoutSession = async (userId: string, orderId: string) => {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Order not found.');
  }

  if (order.userId !== userId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, 'Access denied.');
  }

  if (order.status === 'PAID') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, 'Order is already paid.');
  }

  const totalAmount = Number(order.totalAmount);

  // If order total is 0 (Free Course or 100% Coupon)
  if (totalAmount === 0) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: 'MANUAL',
          providerPaymentId: `free_${Date.now()}`,
          amount: 0,
          currency: order.currency,
          status: 'COMPLETED',
        },
      });

      await enrollmentRepo.createEnrollment(userId, order.courseId);

      if (order.couponId) {
        await couponRepo.recordCouponRedemption(order.couponId, userId, order.id);
      }
    });

    return {
      isFree: true,
      orderId: order.id,
      courseSlug: order.course.slug,
      message: 'Enrollment activated successfully for free course',
    };
  }

  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_default_key';

  return {
    isFree: false,
    orderId: order.id,
    orderNumber: order.orderNumber,
    courseTitle: order.course.title,
    amount: totalAmount * 100, // paise for Razorpay
    currency: order.currency,
    keyId,
  };
};

export const verifyPayment = async (
  userId: string,
  payload: {
    orderId: string;
    provider?: PaymentProvider;
    providerOrderId?: string;
    providerPaymentId: string;
    providerSignature?: string;
  },
) => {
  const order = await orderRepo.findOrderById(payload.orderId);
  if (!order) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Order not found.');
  }

  if (order.userId !== userId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, 'Access denied.');
  }

  if (order.status === 'PAID') {
    return {
      success: true,
      alreadyPaid: true,
      courseSlug: order.course.slug,
    };
  }

  // Signature verification for Razorpay if secret is configured
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keySecret && payload.providerOrderId && payload.providerSignature) {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${payload.providerOrderId}|${payload.providerPaymentId}`)
      .digest('hex');

    if (generatedSignature !== payload.providerSignature) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.BAD_REQUEST,
        'Invalid payment gateway signature.',
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: payload.provider || 'RAZORPAY',
        providerOrderId: payload.providerOrderId,
        providerPaymentId: payload.providerPaymentId,
        providerSignature: payload.providerSignature,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'COMPLETED',
      },
    });

    // Create Enrollment and CourseProgress
    const totalLessons = await tx.lesson.count({
      where: { module: { courseId: order.courseId } },
    });

    await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: order.courseId,
        },
      },
      update: { status: 'ACTIVE' },
      create: {
        userId,
        courseId: order.courseId,
        status: 'ACTIVE',
      },
    });

    await tx.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: order.courseId,
        },
      },
      update: {},
      create: {
        userId,
        courseId: order.courseId,
        progressPercent: 0,
        completedLessonsCount: 0,
        totalLessonsCount: totalLessons,
      },
    });

    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { timesUsed: { increment: 1 } },
      });
      await tx.couponRedemption.create({
        data: {
          couponId: order.couponId,
          userId,
          orderId: order.id,
        },
      });
    }
  });

  return {
    success: true,
    courseSlug: order.course.slug,
    message: 'Payment verified and enrollment created successfully',
  };
};

export const listAdminPayments = async (filters: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}) => {
  const { payments, totalCount, page, limit } = await paymentRepo.findAdminPayments(filters);
  return {
    payments: payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
    totalCount,
    page,
    limit,
  };
};
