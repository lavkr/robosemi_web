import { Response } from 'express';

export function successResponse(
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200,
  meta?: object,
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: meta ?? null,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  code?: string,
  details?: any[],
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: code ?? 'ERROR',
      details: details ?? [],
    },
  });
}

export function paginatedResponse(
  res: Response,
  data: any[],
  total: number,
  page: number,
  limit: number,
  message = 'Success',
): Response {
  const pages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      pages,
    },
  });
}
