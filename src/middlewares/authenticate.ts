import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/helpers/error';
import { env } from '@/libs/env';
import { JWTService } from '@/services/jwt.service';

/**
 * Middleware that verifies the Bearer token from the Authorization header
 * and attaches the decoded payload to `req.user`.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const auth = new JWTService();
  const header = req.headers.authorization;
  const key = env.JWT_ACCESS_TOKEN_NAME;

  if (!header) throw new UnauthorizedError();
  if (!header.startsWith(key)) throw new UnauthorizedError();
  const token = header.slice(key.length + 1);

  const user = auth.verifyAccessToken(token);
  req.user = user;
  next();
};
