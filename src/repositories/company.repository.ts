import { Company } from '@/models/company';
import { BaseRepository } from '@/repositories/base.repository';
import type { CompanyDTO } from '@/types/model';

export class CompanyRepository extends BaseRepository<CompanyDTO> {
  constructor() {
    super(Company, 'company', ['createdBy']);
  }
}
