import type { Request, Response } from 'express';

/**
 *
 */
export const catchall = (_req: Request, res: Response) => {
  res.sendStatus(404);
};
