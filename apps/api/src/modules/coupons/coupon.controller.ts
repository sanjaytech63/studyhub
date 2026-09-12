import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { validateCouponSchema, createCouponSchema } from '@studyhub/validation';
import * as couponService from './coupon.service';

export const validateCouponHandler: RequestHandler = async (req, res) => {
  const { code, courseId } = validateCouponSchema.parse(req.body);
  const result = await couponService.validateCoupon(code, courseId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
};

export const listAdminCouponsHandler: RequestHandler = async (_req, res) => {
  const coupons = await couponService.listAdminCoupons();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: coupons,
  });
};

export const createCouponHandler: RequestHandler = async (req, res) => {
  const validated = createCouponSchema.parse(req.body);
  const coupon = await couponService.createCoupon(validated);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: coupon,
  });
};

export const updateCouponHandler: RequestHandler = async (req, res) => {
  const updated = await couponService.updateCoupon(req.params.id as string, req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};
