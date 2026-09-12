import { Readable } from 'stream';
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

    uploadStream.on('error', (err) => {
      logger.error({ err }, 'Cloudinary avatar stream error');
      reject(
        new AppError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          err?.message ? `Stream error: ${err.message}` : 'Failed to stream avatar to Cloudinary.',
        ),
      );
    });

    Readable.from(buffer).pipe(uploadStream);
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

export interface UploadMediaResult {
  readonly url: string;
  readonly publicId: string;
  readonly bytes?: number;
  readonly format?: string;
  readonly resourceType?: string;
}

export const uploadMediaStream = (
  buffer: Buffer,
  folder = 'studyhub/media',
  resourceType: 'image' | 'video' | 'auto' = 'auto',
): Promise<UploadMediaResult> => {
  if (!isConfigured) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.',
    );
  }

  const isLargeOrVideo = resourceType === 'video' || buffer.length > 20 * 1024 * 1024;
  const uploadFn = isLargeOrVideo
    ? cloudinary.uploader.upload_chunked_stream.bind(cloudinary.uploader)
    : cloudinary.uploader.upload_stream.bind(cloudinary.uploader);

  const options: Record<string, unknown> = {
    folder,
    resource_type: resourceType,
    overwrite: false,
    timeout: 300000, // 5 minutes timeout for Cloudinary API connection
  };

  if (isLargeOrVideo) {
    options.chunk_size = 6000000; // 6MB chunks for videos & large files
  }

  return new Promise((resolve, reject) => {
    const uploadStream = uploadFn(options, (error, result) => {
      if (error || !result) {
        logger.error({ error, folder, resourceType }, 'Cloudinary media upload failed');
        return reject(
          new AppError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error?.message
              ? `Cloudinary upload failed: ${error.message}`
              : 'Failed to upload media file to Cloudinary.',
          ),
        );
      }

      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
        resourceType: result.resource_type,
      });
    });

    uploadStream.on('error', (err) => {
      logger.error({ err }, 'Cloudinary media stream error');
      reject(
        new AppError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          err?.message
            ? `Stream error: ${err.message}`
            : 'Failed to stream media file to Cloudinary.',
        ),
      );
    });

    Readable.from(buffer).pipe(uploadStream);
  });
};

export interface CloudinaryUploadSignature {
  readonly signature: string;
  readonly timestamp: number;
  readonly apiKey: string;
  readonly cloudName: string;
  readonly folder: string;
  readonly resourceType: 'video' | 'image' | 'auto';
  readonly eager?: string;
  readonly eagerAsync?: boolean;
}

export const generateUploadSignature = (
  folder = 'studyhub/courses/videos',
  resourceType: 'video' | 'image' | 'auto' = 'video',
): CloudinaryUploadSignature => {
  if (!isConfigured) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.',
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number | boolean> = {
    folder,
    timestamp,
  };

  if (resourceType === 'video') {
    paramsToSign.eager = 'f_mp4,q_auto:good,vc_h264';
    paramsToSign.eager_async = true;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    serverConfig.cloudinary.apiSecret!,
  );

  return {
    signature,
    timestamp,
    apiKey: serverConfig.cloudinary.apiKey!,
    cloudName: serverConfig.cloudinary.cloudName!,
    folder,
    resourceType,
    eager: paramsToSign.eager as string | undefined,
    eagerAsync: paramsToSign.eager_async as boolean | undefined,
  };
};
