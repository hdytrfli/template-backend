import { Router } from 'express';

import { AuthController } from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/authenticate';

const router: Router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.use(authenticate);
router.get('/profile', authController.profile);
router.patch('/:id/password', authController.changePassword);
router.patch('/:id/profile', authController.updateProfile);

export const authRouter = router;
