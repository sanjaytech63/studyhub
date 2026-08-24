import axios from 'axios';

export interface ApiErrorOptions {
  readonly message: string;
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;
}

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor({ message, statusCode, code, details, requestId }: ApiErrorOptions) {
    super(message);

    this.name = 'ApiError';

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.requestId = requestId;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface BackendError {
  readonly code?: unknown;
  readonly message?: unknown;
  readonly details?: unknown;
  readonly requestId?: unknown;
}

interface BackendErrorResponse {
  readonly success?: unknown;
  readonly error?: BackendError;
  readonly message?: unknown;
  readonly code?: unknown;
  readonly details?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function extractBackendError(data: unknown): BackendErrorResponse | null {
  if (!isRecord(data)) {
    return null;
  }

  return data as BackendErrorResponse;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const response = error.response;

    const data = extractBackendError(response?.data);

    const nestedError = data?.error;

    if (nestedError) {
      return new ApiError({
        message: isString(nestedError.message)
          ? nestedError.message
          : 'Unable to complete the request.',

        statusCode: response?.status,

        code: isString(nestedError.code) ? nestedError.code : error.code,

        details: nestedError.details,

        requestId: isString(nestedError.requestId) ? nestedError.requestId : undefined,
      });
    }

    return new ApiError({
      message: isString(data?.message)
        ? data.message
        : error.message || 'Unable to complete the request.',

      statusCode: response?.status,

      code: isString(data?.code) ? data.code : error.code,

      details: data?.details,
    });
  }

  if (isRecord(error) && isString(error.message)) {
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
    return error.message || fallback;
  }

  if (isRecord(error) && isString(error.message)) {
    return error.message;
  }

  return fallback;
}
