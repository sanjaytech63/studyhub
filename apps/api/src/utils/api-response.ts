import type { Response } from 'express';

import { HTTP_STATUS, type HttpStatus } from './http-status';

type ResponseMeta = {
  requestId?: string;
  [key: string]: unknown;
};

export class ApiResponse {
  private constructor() {}

  /**
   * Standard successful API response.
   *
   * Response shape:
   *
   * {
   *   success: true,
   *   message?: string,
   *   data: {},
   *   meta: {}
   * }
   */
  public static success<T>(
    res: Response,
    data: T,
    statusCode: HttpStatus = HTTP_STATUS.OK,
    meta?: ResponseMeta,
    message?: string,
  ): Response {
    const resolvedMessage =
      message ??
      (typeof data === 'object' && data !== null && 'message' in data
        ? ((data as Record<string, unknown>).message as string)
        : undefined);

    return res.status(statusCode).json({
      success: true,
      ...(resolvedMessage ? { message: resolvedMessage } : {}),
      data,
      ...(meta ? { meta } : {}),
    });
  }

  public static ok<T>(res: Response, data: T, meta?: ResponseMeta, message?: string): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta, message);
  }

  public static created<T>(
    res: Response,
    data: T,
    meta?: ResponseMeta,
    message?: string,
  ): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.CREATED, meta, message);
  }

  public static accepted<T>(
    res: Response,
    data: T,
    meta?: ResponseMeta,
    message?: string,
  ): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.ACCEPTED, meta, message);
  }

  public static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
