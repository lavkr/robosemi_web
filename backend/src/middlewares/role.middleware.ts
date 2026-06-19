import { Request, Response, NextFunction, RequestHandler } from 'express';
import { errorResponse } from '../helpers/response';

export function requireRole(...roles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401, 'NOT_AUTHENTICATED');
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(
        res,
        `Access denied. Required roles: ${roles.join(', ')}`,
        403,
        'FORBIDDEN',
      );
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole('admin', 'staff');
export const requireSeller = requireRole('seller', 'admin');
export const requireUser = requireRole('user', 'seller', 'admin', 'staff');
