import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { verifyCertificateHandler, getMyCertificatesHandler } from './certificate.controller';

const router = Router();

// Public verification
router.get('/certificates/:code', verifyCertificateHandler);

// Authenticated student certificates
router.get('/me/certificates', requireAuth, getMyCertificatesHandler);

export default router;
