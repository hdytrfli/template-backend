import { Router } from 'express';

import { UserController } from '@/controllers/user.controller';

const router: Router = Router();
const userController = new UserController();

router.get('/', userController.index);
router.get('/:id', userController.findById);
router.post('/', userController.create);
router.patch('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
