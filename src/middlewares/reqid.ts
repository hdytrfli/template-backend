import crypto from 'crypto';

import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to assign a unique request ID to each incoming request and set it in the response header.
 */
export const reqid = (req: Request, res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};
