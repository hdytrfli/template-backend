import * as z from 'zod';

import { BaseController } from '@/controllers/base.controller';
import { CompanyRepository } from '@/repositories/company.repository';
import type { CompanyDTO } from '@/types/model';

const createCompanySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  type: z.string().min(1).max(100),
  country: z.object({
    code: z.string().min(1).max(10),
    label: z.string().min(1).max(100),
  }),
});

const updateCompanySchema = createCompanySchema.partial();

/**
 * Controller to handle company related data.
 */
export class CompanyController extends BaseController<
  CompanyDTO,
  z.infer<typeof createCompanySchema>,
  z.infer<typeof updateCompanySchema>
> {
  constructor() {
    super(
      new CompanyRepository(),
      createCompanySchema,
      updateCompanySchema,
      ['name', 'country.code', 'country.label', 'type'],
      ['name', 'country.label', 'type', 'createdAt'],
    );
  }
}
