import type { NextFunction, Request, Response } from 'express';

/**
 * Records request start, end and duration and sets header before response is sent.
 */
export const timer = (_req: Request, res: Response, next: NextFunction) => {
  const startInt = process.hrtime.bigint();
  const start = new Date().toISOString();

  const original = res.send;
  res.send = function (body) {
    const endInt = process.hrtime.bigint();

    const end = new Date().toISOString();
    const duration = Number(endInt - startInt) / 1_000_000;

    res.setHeader('X-Execution-Start', start);
    res.setHeader('X-Execution-End', end);
    res.setHeader('X-Execution-Time-Ms', duration.toFixed(3));

    return original.call(this, body);
  };

  next();
};
