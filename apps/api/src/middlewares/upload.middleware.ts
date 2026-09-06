import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.INVALID_REQUEST,
          'Invalid file format. Only JPEG, PNG, and WEBP images are supported.',
        ),
      );
    }
  },
});

export const uploadSingleAvatar = (req: Request, res: Response, next: NextFunction) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.INVALID_REQUEST,
              'Image file size exceeds the 5MB limit.',
            ),
          );
        }
        return next(
          new AppError(
            HTTP_STATUS.BAD_REQUEST,
            ERROR_CODES.INVALID_REQUEST,
            `Upload error: ${err.message}`,
          ),
        );
      }
      return next(err);
    }

    if (!req.file) {
      return next(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.INVALID_REQUEST,
          'Please provide an image file under the "avatar" field.',
        ),
      );
    }

    next();
  });
};
