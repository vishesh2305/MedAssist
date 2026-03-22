import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Access denied. Required role(s): ${allowedRoles.join(', ')}`));
    }

    next();
  };
}

export function requireSelf(paramName = 'userId') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const targetUserId = req.params[paramName];
    if (targetUserId && targetUserId !== req.user.userId && req.user.role !== 'SUPER_ADMIN') {
      return next(ApiError.forbidden('You can only access your own resources'));
    }

    next();
  };
}
