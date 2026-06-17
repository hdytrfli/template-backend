import { Router, type Request } from 'express';

import { database } from '@/database';
import type { AppResponse } from '@/types/response';

const router: Router = Router();

type RepositoryReport = Record<string, boolean>;

router.get('/', async (_req: Request, res: AppResponse<null>) => {
  return res.json({
    success: true,
    message: 'Version 1 API',
  });
});

router.get('/healthcheck', async (_req: Request, res: AppResponse<RepositoryReport>) => {
  const db = await database.healthcheck();

  return res.json({
    success: true,
    message: 'Application is healthy',
    data: {
      database: db,
    },
  });
});

export const debugRouter = router;
