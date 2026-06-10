import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { development } from '@/middlewares/development';
import { authRouter } from '@/routers/v1/auth.route';
import { companyRouter } from '@/routers/v1/company.route';
import { debugRouter } from '@/routers/v1/debug.route';
import { developmentRouter } from '@/routers/v1/developement.route';
import { userRouter } from '@/routers/v1/user.route';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/debug', debugRouter);
router.use('/development', development, developmentRouter);

router.use('/users', authenticate, userRouter);
router.use('/companies', authenticate, companyRouter);

export default router;
