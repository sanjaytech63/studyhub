import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  uploadMediaStream,
  generateUploadSignature,
} from '@/infrastructure/cloudinary/cloudinary.client';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { asyncHandler } from '@/utils/async-handler';

const router = Router();

const MAX_MEDIA_SIZE = 200 * 1024 * 1024; // 200MB for video lectures and trailers

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_MEDIA_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const isImage =
      file.mimetype.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(file.originalname);

    const isVideo =
      file.mimetype.startsWith('video/') ||
      /\.(mp4|webm|mov|mkv|avi|wmv|m4v|3gp|flv|ogv|ts)$/i.test(file.originalname);

    if (isImage || isVideo) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.INVALID_REQUEST,
          `Unsupported file type: ${file.mimetype || 'unknown'}. Please provide a valid image or video file.`,
        ),
      );
    }
  },
});

const uploadSingleMedia = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === 'LIMIT_FILE_SIZE'
            ? 'File exceeds maximum size limit of 200MB.'
            : `Upload error: ${err.message}`;
        return next(new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_REQUEST, message));
      }
      return next(err);
    }
    if (!req.file) {
      return next(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.INVALID_REQUEST,
          'Please provide a file under the "file" form field.',
        ),
      );
    }
    next();
  });
};

/**
 * POST /api/v1/admin/media/upload
 * Requires auth and course:create permission.
 */
router.post(
  '/admin/media/upload',
  requireAuth,
  requirePermission('course:create'),
  uploadSingleMedia,
  asyncHandler(async (req: Request, res: Response) => {
    const file = req.file!;
    const isVideo =
      file.mimetype.startsWith('video/') ||
      /\.(mp4|webm|mov|mkv|avi|wmv|m4v|3gp|flv|ogv|ts)$/i.test(file.originalname);
    const resourceType = isVideo ? 'video' : 'image';
    const folder = isVideo ? 'studyhub/courses/videos' : 'studyhub/courses/thumbnails';

    const result = await uploadMediaStream(file.buffer, folder, resourceType);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        resourceType: result.resourceType,
        bytes: result.bytes,
        format: result.format,
      },
    });
  }),
);

/**
 * POST /api/v1/admin/media/signature
 * Generates signed Cloudinary upload params for direct client-to-CDN uploading.
 * Eliminates server memory buffering, proxy timeouts, and enables accurate real-time progress.
 */
router.post(
  '/admin/media/signature',
  requireAuth,
  requirePermission('course:create'),
  asyncHandler(async (req: Request, res: Response) => {
    const { folder, resourceType } = req.body || {};
    const effectiveResourceType =
      resourceType === 'image' || resourceType === 'video' ? resourceType : 'auto';
    const effectiveFolder =
      typeof folder === 'string' && folder.trim().length > 0
        ? folder.trim()
        : effectiveResourceType === 'video'
          ? 'studyhub/courses/videos'
          : 'studyhub/courses/thumbnails';

    const signatureData = generateUploadSignature(effectiveFolder, effectiveResourceType);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: signatureData,
    });
  }),
);

export default router;
