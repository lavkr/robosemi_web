import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { errorResponse } from '../helpers/response';

export interface RequestUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

interface JwtPayload {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

function extractTokenFromCookie(req: Request): string | null {
  // Support NextAuth session token in cookies
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [key, ...val] = cookie.trim().split('=');
    cookies[key] = val.join('=');
  });

  return (
    cookies['next-auth.session-token'] ||
    cookies['__Secure-next-auth.session-token'] ||
    null
  );
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Try Bearer token first
    let token = extractTokenFromHeader(req);
    let secret = env.JWT_SECRET;
    let isNextAuth = false;

    if (!token) {
      // Fallback to NextAuth cookie
      token = extractTokenFromCookie(req);
      if (token) {
        secret = env.NEXTAUTH_SECRET;
        isNextAuth = true;
      }
    }

    if (!token) {
      errorResponse(res, 'Authentication required', 401, 'NO_TOKEN');
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.sub || decoded.id || decoded.userId;
    if (!userId) {
      errorResponse(res, 'Invalid token: missing user identifier', 401, 'INVALID_TOKEN');
      return;
    }

    req.user = {
      userId,
      email: decoded.email ?? '',
      role: decoded.role ?? 'user',
      name: decoded.name ?? '',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errorResponse(res, 'Token has expired', 401, 'TOKEN_EXPIRED');
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(res, 'Invalid token', 401, 'INVALID_TOKEN');
    } else {
      errorResponse(res, 'Authentication failed', 401, 'AUTH_FAILED');
    }
  }
}
