import type { NextFunction, Request, Response } from 'express';

import { ForbiddenError } from '@/helpers/error';
import { env } from '@/libs/env';

/**
 * Middleware that verify if the current environtment is development
 */
export const development = (_req: Request, _res: Response, next: NextFunction) => {
  const check = env.NODE_ENV === 'development';
  if (!check) throw new ForbiddenError('this route only available in dev mode');
  next();
};
