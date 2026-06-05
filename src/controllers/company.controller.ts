import * as z from 'zod';

import { BaseController } from '@/controllers/base.controller';
import { CompanyRepository } from '@/repositories/company.repository';
import type { CompanyDTO } from '@/types/model';

const createCompanySchema = z.object({
  name: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  email: z.email(),
  companyType: z.string().min(1).max(100),
});

const updateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  country: z.string().min(1).max(100).optional(),
  email: z.email().optional(),
  companyType: z.string().min(1).max(100).optional(),
});

/**
 * Controller to handle company related data.
 */
export class CompanyController extends BaseController<
  CompanyDTO,
  z.infer<typeof createCompanySchema>,
  z.infer<typeof updateCompanySchema>
> {
  constructor() {
    super(new CompanyRepository(), createCompanySchema, updateCompanySchema, [
      'name',
      'country',
      'companyType',
    ]);
  }
}
