import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import authRouter from '@/routers/v1/auth.route';
import companyRouter from '@/routers/v1/company.route';
import debugRouter from '@/routers/v1/debug.route';
import userRouter from '@/routers/v1/user.route';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/debug', debugRouter);

router.use(authenticate);
router.use('/users', userRouter);
router.use('/companies', companyRouter);

export default router;
