import { Router, type Request } from 'express';

import { database } from '@/database';
import type { AppResponse } from '@/helpers/response';

const router: Router = Router();

type RepositoryReport = {
  database: boolean;
};

router.get('/', async (_req: Request, res: AppResponse<RepositoryReport>) => {
  const db = await database.healthcheck();

  return res.json({
    success: true,
    message: 'Repository is healthy',
    data: { database: db },
  });
});

export default router;
