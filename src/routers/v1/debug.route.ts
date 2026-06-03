import { Router, type Request } from 'express';

import { database } from '@/database';
import type { AppResponse } from '@/helpers/response';

const router: Router = Router();

type ServiceReport = {
  database: boolean;
};

router.get('/', async (_req: Request, res: AppResponse<ServiceReport>) => {
  const db = await database.healthcheck();

  return res.json({
    success: true,
    message: 'Service is healthy',
    data: { database: db },
  });
});

export default router;
