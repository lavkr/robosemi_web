import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    error: { code: 'RATE_LIMIT_EXCEEDED', details: [] },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    error: { code: 'RATE_LIMIT_EXCEEDED', details: [] },
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.',
    error: { code: 'RATE_LIMIT_EXCEEDED', details: [] },
  },
});

// Aliases for route files
export const authRateLimiter = authLimiter;
export const uploadRateLimiter = uploadLimiter;
