import { Router } from 'express';

import { authController } from '@/controllers/auth.controller';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/:id/password', authController.changePassword);
router.patch('/:id/profile', authController.updateProfile);

export default router;
