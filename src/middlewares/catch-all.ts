import type { Request, Response } from 'express';

/**
 * Middleware to catch all unkown routes and response with 404
 */
export const catchall = (_req: Request, res: Response) => {
  res.sendStatus(404);
};
