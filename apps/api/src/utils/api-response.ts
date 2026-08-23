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
   *   data: {},
   *   meta: {}
   * }
   */
  public static success<T>(
    res: Response,
    data: T,
    statusCode: HttpStatus = HTTP_STATUS.OK,
    meta?: ResponseMeta,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,

      ...(meta
        ? {
            meta,
          }
        : {}),
    });
  }

  public static ok<T>(res: Response, data: T, meta?: ResponseMeta): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta);
  }

  public static created<T>(res: Response, data: T, meta?: ResponseMeta): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.CREATED, meta);
  }

  public static accepted<T>(res: Response, data: T, meta?: ResponseMeta): Response {
    return ApiResponse.success(res, data, HTTP_STATUS.ACCEPTED, meta);
  }

  public static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
