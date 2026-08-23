import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendOtpController,
  verifyEmailOtpController,
} from './auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/register', registerController);
router.post('/verify-otp', verifyEmailOtpController);
router.post('/resend-otp', resendOtpController);
router.post('/login', loginController);
router.post('/refresh', refreshTokenController);
router.post('/logout', requireAuth, logoutController);

export default router;

// router.get(
//   '/users',
//   requireAuth,
//   requirePermission('user:read'),
//   getUsersController,
// );

// router.post(
//   '/courses/:id/publish',
//   requireAuth,
//   requirePermission('course:publish'),
//   publishCourseController,
// );
