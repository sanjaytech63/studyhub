import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { prisma } from '@studyhub/database';
import * as couponRepo from './coupon.repository';

export const validateCoupon = async (code: string, courseId: string) => {
  const [coupon, course] = await Promise.all([
    couponRepo.findCouponByCode(code),
    prisma.course.findUnique({ where: { id: courseId } }),
  ]);

  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }

  if (!coupon || !coupon.isActive) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      'Invalid or inactive coupon code.',
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

  const coursePrice = Number(course.price);
  if (coursePrice < Number(coupon.minOrderAmount)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      `Coupon requires a minimum order amount of ₹${coupon.minOrderAmount}.`,
    );
  }

  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (coursePrice * Number(coupon.discountValue)) / 100;
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
    discountAmount = Number(coupon.maxDiscount);
  }

  discountAmount = Math.min(discountAmount, coursePrice);
  const finalPrice = Math.max(0, coursePrice - discountAmount);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    discountAmount,
    originalPrice: coursePrice,
    finalPrice,
  };
};

export const listAdminCoupons = async () => {
  const coupons = await couponRepo.listCoupons();
  return coupons.map((c) => ({
    ...c,
    discountValue: Number(c.discountValue),
    maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
    minOrderAmount: Number(c.minOrderAmount),
  }));
};

export const createCoupon = async (data: any) => {
  const existing = await couponRepo.findCouponByCode(data.code);
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, 'Coupon code already exists.');
  }
  return couponRepo.createCoupon(data);
};

export const updateCoupon = async (id: string, data: any) => {
  const existing = await couponRepo.findCouponById(id);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Coupon not found.');
  }
  return couponRepo.updateCoupon(id, data);
};
