import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { z } from 'zod';
import { verifyPaymentSchema } from '@studyhub/validation';
import * as paymentService from './payment.service';

const checkoutSessionSchema = z.object({
  orderId: z.string().uuid(),
});

export const createCheckoutSessionHandler: RequestHandler = async (req, res) => {
  const { orderId } = checkoutSessionSchema.parse(req.body);
  const session = await paymentService.createCheckoutSession(req.user!.id, orderId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: session,
  });
};

export const verifyPaymentHandler: RequestHandler = async (req, res) => {
  const validated = verifyPaymentSchema.parse(req.body);
  const result = await paymentService.verifyPayment(req.user!.id, validated as any);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
};

export const listAdminPaymentsHandler: RequestHandler = async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await paymentService.listAdminPayments({
    status: status as any,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.payments,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
};
