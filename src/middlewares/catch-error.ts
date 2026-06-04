import type { NextFunction, Request } from 'express';
import { z, ZodError } from 'zod';

import { AppError } from '@/helpers/error';
import type { AppResponse } from '@/helpers/response';
import { log } from '@/libs/logger';

/**
 * Middleware to catch error that happen inside request and response handler
 */
export const catcherr = (err: Error, req: Request, res: AppResponse<null>, _next: NextFunction) => {
  log.error({
    path: req.path,
    method: req.method,
    message: err.message,
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: z.flattenError(err),
      message: 'Validation failed',
    });
  }

  if (err instanceof AppError) res.status(err.code);
  else res.status(500);

  return res.json({
    success: false,
    message: err.message,
  });
};
