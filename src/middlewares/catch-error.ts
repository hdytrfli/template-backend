import type { NextFunction, Request } from 'express';
import { z, ZodError } from 'zod';

import { AppError } from '@/helpers/error';
import { log } from '@/libs/logger';
import type { ErrorResponse } from '@/types/response';

/**
 * Middleware to catch error that happen inside request and response handler
 */
export const catcherr = (err: Error, req: Request, res: ErrorResponse, _next: NextFunction) => {
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

  if (err instanceof AppError) {
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Server error',
  });
};
