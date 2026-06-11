import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/helpers/error';
import { env } from '@/libs/env';
import { JWTService } from '@/services/jwt.service';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const auth = new JWTService();
  const header = req.headers.authorization;
  const key = env.JWT_ACCESS_TOKEN_NAME;

  if (!header) throw new UnauthorizedError();
  if (!header.startsWith(key)) throw new UnauthorizedError();
  const token = header.slice(key.length + 1);

  const user = await auth.verifyAccessToken(token);
  req.user = user;
  next();
};
