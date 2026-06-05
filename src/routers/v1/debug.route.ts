import { Router, type Request } from 'express';

import { database, redis } from '@/database';
import { socket } from '@/services/socket.service';
import type { AppResponse } from '@/types/response';

const router: Router = Router();

type RepositoryReport = Record<string, boolean>;

router.get('/', async (_req: Request, res: AppResponse<null>) => {
  socket.client.emit('testing', {
    title: 'hello world',
  });

  return res.json({
    success: true,
    message: 'Version 1 API',
  });
});

router.get('/healthcheck', async (_req: Request, res: AppResponse<RepositoryReport>) => {
  const db = await database.healthcheck();
  const rd = await redis.healthcheck();

  return res.json({
    success: true,
    message: 'Application is healthy',
    data: {
      database: db,
      redis: rd,
    },
  });
});

export const debugRouter = router;
