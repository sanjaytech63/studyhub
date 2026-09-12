import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import {
  getWishlistHandler,
  addToWishlistHandler,
  removeFromWishlistHandler,
} from './wishlist.controller';

const router = Router();

router.get('/me/wishlist', requireAuth, getWishlistHandler);
router.post('/courses/:id/wishlist', requireAuth, addToWishlistHandler);
router.delete('/courses/:id/wishlist', requireAuth, removeFromWishlistHandler);

export default router;
