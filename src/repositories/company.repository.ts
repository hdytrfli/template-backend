import { Company } from '@/models/company';
import type { CompanyDTO } from '@/models/types';
import { BaseRepository } from '@/repositories/base.repository';

export class CompanyRepository extends BaseRepository<CompanyDTO> {
  constructor() {
    super(Company, 'company', ['createdBy']);
  }
}
