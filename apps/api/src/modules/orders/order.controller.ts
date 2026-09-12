import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { createOrderSchema } from '@studyhub/validation';
import * as orderService from './order.service';

export const createOrderHandler: RequestHandler = async (req, res) => {
  const { courseId, couponCode } = createOrderSchema.parse(req.body);
  const order = await orderService.createOrder(req.user!.id, courseId, couponCode);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: order,
  });
};

export const getMyOrdersHandler: RequestHandler = async (req, res) => {
  const orders = await orderService.getMyOrders(req.user!.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: orders,
  });
};

export const listAdminOrdersHandler: RequestHandler = async (req, res) => {
  const { status, search, page, limit } = req.query;
  const result = await orderService.listAdminOrders({
    status: status as any,
    search: search as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.orders,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
};
