import type { NextFunction, Request, Response } from 'express';

import { env } from '@/libs/env';
import { ActivityLog } from '@/models/activity-log';
import type { RequestMethod } from '@/types/util';

export const activityLog = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const duration = res.getHeader('X-Execution-Time-Ms') as string;
    const userAgent = req.get('user-agent');

    void ActivityLog.create({
      requestId: req.id.toString(),
      requestMethod: req.method as RequestMethod,
      requestPath: req.originalUrl,
      ipAddress: req.ip,
      environment: env.NODE_ENV,
      statusCode: res.statusCode,
      userAgent: userAgent,
      duration: duration ? parseInt(duration, 10) : undefined,
      user: req.user && req.user.sub,
    });
  });

  next();
};
