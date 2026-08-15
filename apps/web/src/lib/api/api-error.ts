import axios from 'axios';

export interface ApiErrorOptions {
  readonly message: string;
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: unknown;
}

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor({ message, statusCode, code, details }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return new ApiError({
        message: responseData.message,
        statusCode: error.response?.status,
        code:
          'code' in responseData && typeof responseData.code === 'string'
            ? responseData.code
            : error.code,
        details: 'details' in responseData ? responseData.details : undefined,
      });
    }

    return new ApiError({
      message: error.message || 'Unable to complete the request.',
      statusCode: error.response?.status,
      code: error.code,
    });
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return new ApiError({
      message: error.message,
    });
  }

  return new ApiError({
    message: 'Something went wrong.',
  });
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallback;
}
