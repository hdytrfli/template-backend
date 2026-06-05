import { Router } from 'express';

import { AuthController } from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/authenticate';

const router: Router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.patch('/:id/password', authenticate, authController.changePassword);
router.patch('/:id/profile', authenticate, authController.updateProfile);

export const authRouter = router;
