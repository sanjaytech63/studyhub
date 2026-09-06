import { v2 as cloudinary } from 'cloudinary';
import { serverConfig } from '@studyhub/config/server';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { logger } from '@/config/logger';

const isConfigured = Boolean(
  serverConfig.cloudinary.cloudName &&
  serverConfig.cloudinary.apiKey &&
  serverConfig.cloudinary.apiSecret,
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: serverConfig.cloudinary.cloudName,
    api_key: serverConfig.cloudinary.apiKey,
    api_secret: serverConfig.cloudinary.apiSecret,
    secure: true,
  });
  logger.info('Cloudinary client initialized successfully');
} else {
  logger.warn(
    'Cloudinary credentials are missing. Avatar uploads to Cloudinary will require them.',
  );
}

export interface UploadAvatarResult {
  readonly url: string;
  readonly publicId: string;
}

export const uploadAvatarStream = (buffer: Buffer, userId: string): Promise<UploadAvatarResult> => {
  if (!isConfigured) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.',
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'studyhub/avatars',
        public_id: `avatar_${userId}`,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          logger.error({ error }, 'Cloudinary avatar upload failed');
          return reject(
            new AppError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_CODES.INTERNAL_SERVER_ERROR,
              'Failed to upload image to Cloudinary.',
            ),
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteAvatarByPublicId = async (publicId: string): Promise<void> => {
  if (!isConfigured) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    logger.warn({ error, publicId }, 'Failed to delete previous avatar from Cloudinary');
  }
};
