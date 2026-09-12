import crypto from 'node:crypto';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { prisma, OrderStatus } from '@studyhub/database';
import * as orderRepo from './order.repository';
import * as couponRepo from '../coupons/coupon.repository';

export const createOrder = async (userId: string, courseId: string, couponCode?: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }

  // Check if student is already actively enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      'You are already enrolled in this course.',
    );
  }

  const subtotalAmount = Number(course.price);
  let discountAmount = 0;
  let appliedCouponId: string | undefined;

  if (couponCode && subtotalAmount > 0) {
    const coupon = await couponRepo.findCouponByCode(couponCode);
    if (!coupon || !coupon.isActive) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.BAD_REQUEST,
        'Invalid or inactive coupon.',
      );
    }

    const now = new Date();
    if (coupon.validFrom > now || (coupon.validTo && coupon.validTo < now)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, 'Coupon has expired.');
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.BAD_REQUEST,
        'Coupon usage limit has been reached.',
      );
    }

    if (subtotalAmount < Number(coupon.minOrderAmount)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.BAD_REQUEST,
        `Coupon requires a minimum order amount of ${coupon.minOrderAmount}.`,
      );
    }

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotalAmount * Number(coupon.discountValue)) / 100;
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
      discountAmount = Number(coupon.maxDiscount);
    }

    discountAmount = Math.min(discountAmount, subtotalAmount);
    appliedCouponId = coupon.id;
  }

  const totalAmount = Math.max(0, subtotalAmount - discountAmount);

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const order = await orderRepo.createOrder({
    orderNumber,
    userId,
    courseId,
    subtotalAmount,
    discountAmount,
    totalAmount,
    currency: 'INR',
    couponId: appliedCouponId,
  });

  return {
    ...order,
    subtotalAmount: Number(order.subtotalAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
  };
};

export const getMyOrders = async (userId: string) => {
  const orders = await orderRepo.findStudentOrders(userId);
  return orders.map((o) => ({
    ...o,
    subtotalAmount: Number(o.subtotalAmount),
    discountAmount: Number(o.discountAmount),
    totalAmount: Number(o.totalAmount),
  }));
};

export const listAdminOrders = async (filters: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { orders, totalCount, page, limit } = await orderRepo.findAdminOrders(filters);
  return {
    orders: orders.map((o) => ({
      ...o,
      subtotalAmount: Number(o.subtotalAmount),
      discountAmount: Number(o.discountAmount),
      totalAmount: Number(o.totalAmount),
    })),
    totalCount,
    page,
    limit,
  };
};
