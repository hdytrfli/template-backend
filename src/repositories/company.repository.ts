import { Company } from '@/models/company';
import type { CompanyDTO } from '@/types/model';

import { SoftDeletableRepository } from './soft-deletable.repository';

export class CompanyRepository extends SoftDeletableRepository<CompanyDTO> {
  constructor() {
    super(Company, 'company', ['createdBy']);
  }
}
