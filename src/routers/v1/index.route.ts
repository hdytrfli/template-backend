import { Router, type Request } from 'express';

import type { AppResponse } from '@/helpers/response';
import debugRouter from '@/routers/v1/debug.route';
import userRouter from '@/routers/v1/user.route';

const router: Router = Router();

router.get('/', (_req: Request, res: AppResponse<null>) => {
  return res.json({
    success: true,
    message: 'Version 1 API',
  });
});

router.get('/ping', (_req: Request, res: AppResponse<null>) => {
  return res.json({
    success: true,
    message: 'pong',
  });
});

router.use('/users', userRouter);
router.use('/healthcheck', debugRouter);

export default router;
