import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface AppError extends Error {
  statusCode?: number;
  code?: number | string;
  errors?: Record<string, { message: string }>;
  kind?: string;
  path?: string;
  value?: string;
  keyValue?: Record<string, unknown>;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error('[Error]', err);

  // Zod validation error
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: { code: 'VALIDATION_ERROR', details },
    });
    return;
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: 'Token has expired',
      error: { code: 'TOKEN_EXPIRED', details: [] },
    });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: { code: 'INVALID_TOKEN', details: [] },
    });
    return;
  }

  // MongoDB duplicate key error (code 11000)
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
      error: { code: 'DUPLICATE_KEY', details: [{ field }] },
    });
    return;
  }

  // Mongoose CastError
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}: ${err.value}`,
      error: { code: 'CAST_ERROR', details: [] },
    });
    return;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: (e as any).path,
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: { code: 'MONGOOSE_VALIDATION', details },
    });
    return;
  }

  // Custom app errors with statusCode
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { code: 'APP_ERROR', details: [] },
    });
    return;
  }

  // Generic 500
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: { code: 'INTERNAL_ERROR', details: [] },
  });
}
