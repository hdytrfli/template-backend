import * as z from 'zod';

import { BaseController } from '@/controllers/base.controller';
import type { CompanyDTO } from '@/models/types';
import { CompanyRepository } from '@/repositories/company.repository';

const createCompanySchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  level: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().optional(),
});

const updateCompanySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  level: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
});

/**
 * Controller to handle user related data.
 */
export class CompanyController extends BaseController<
  CompanyDTO,
  z.infer<typeof createCompanySchema>,
  z.infer<typeof updateCompanySchema>
> {
  constructor() {
    super(new CompanyRepository(), createCompanySchema, updateCompanySchema, ['name', 'email']);
  }
}
