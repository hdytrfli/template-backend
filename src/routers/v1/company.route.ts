import { Router } from 'express';

import { CompanyController } from '@/controllers/company.controller';

const router: Router = Router();
const companyController = new CompanyController();

router.get('/', companyController.index);
router.get('/:id', companyController.findById);
router.post('/', companyController.create);
router.patch('/:id', companyController.update);
router.delete('/:id', companyController.delete);

export default router;
