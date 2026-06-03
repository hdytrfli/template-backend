import { Router } from 'express';

import { userController } from '@/controllers/user.controller';

const router: Router = Router();

router.get('/', userController.list);
router.get('/:id', userController.findById);
router.post('/', userController.create);
router.patch('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
