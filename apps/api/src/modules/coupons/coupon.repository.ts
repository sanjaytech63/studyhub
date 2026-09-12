import { prisma, DiscountType } from '@studyhub/database';

export const findCouponByCode = async (code: string) => {
  return prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
};

export const findCouponById = async (id: string) => {
  return prisma.coupon.findUnique({
    where: { id },
  });
};

export const listCoupons = async () => {
  return prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          orders: true,
          redemptions: true,
        },
      },
    },
  });
};

export const createCoupon = async (data: {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  validFrom?: Date;
  validTo?: Date;
  isActive?: boolean;
}) => {
  return prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxDiscount: data.maxDiscount,
      minOrderAmount: data.minOrderAmount ?? 0,
      usageLimit: data.usageLimit,
      validFrom: data.validFrom ?? new Date(),
      validTo: data.validTo,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateCoupon = async (id: string, data: any) => {
  return prisma.coupon.update({
    where: { id },
    data,
  });
};

export const recordCouponRedemption = async (
  couponId: string,
  userId: string,
  orderId?: string,
) => {
  return prisma.$transaction([
    prisma.coupon.update({
      where: { id: couponId },
      data: { timesUsed: { increment: 1 } },
    }),
    prisma.couponRedemption.create({
      data: {
        couponId,
        userId,
        orderId,
      },
    }),
  ]);
};
