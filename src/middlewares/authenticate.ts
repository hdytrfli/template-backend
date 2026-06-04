import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/helpers/error';
import { AuthService } from '@/services/auth.service';

/**
 * Middleware that verifies the Bearer token from the Authorization header
 * and attaches the decoded payload to `req.user`.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const auth = new AuthService();
  const header = req.headers.authorization;

  if (!header) throw new UnauthorizedError('Missing token');
  if (!header.startsWith('Bearer ')) throw new UnauthorizedError('Missing token');
  const token = header.slice(7);

  try {
    req.user = auth.verifyAccessToken(token);
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
