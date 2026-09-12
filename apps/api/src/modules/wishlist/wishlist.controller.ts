import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import * as wishlistService from './wishlist.service';

export const getWishlistHandler: RequestHandler = async (req, res) => {
  const items = await wishlistService.getWishlist(req.user!.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: items,
  });
};

export const addToWishlistHandler: RequestHandler = async (req, res) => {
  await wishlistService.addCourseToWishlist(req.user!.id, req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Course added to wishlist',
  });
};

export const removeFromWishlistHandler: RequestHandler = async (req, res) => {
  await wishlistService.removeCourseFromWishlist(req.user!.id, req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Course removed from wishlist',
  });
};
