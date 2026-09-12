import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import * as analyticsService from './analytics.service';

export const getAdminAnalyticsHandler: RequestHandler = async (_req, res) => {
  const data = await analyticsService.getAdminAnalyticsOverview();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data,
  });
};
