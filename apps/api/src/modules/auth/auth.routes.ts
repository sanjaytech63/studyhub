import { Router } from 'express';
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendOtpController,
  resetPasswordController,
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
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/change-password', requireAuth, changePasswordController);

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
