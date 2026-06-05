import { Hash } from '@/helpers/hash';
import { User } from '@/models/user';
import { BaseRepository } from '@/repositories/base.repository';
import type { PrivateUserDTO } from '@/types/model';

export class UserRepository extends BaseRepository<PrivateUserDTO> {
  constructor() {
    super(User, 'user', ['createdBy']);
  }

  override async create(data: PrivateUserDTO) {
    return super.create({
      ...data,
      password: Hash.hash(data.password),
    });
  }

  async findByUsername(username: string) {
    return this.model.findOne({
      username,
    });
  }

  async updatePassword(id: string, password: string) {
    return this.model.findByIdAndUpdate(id, { password: Hash.hash(password) }, { new: true });
  }
}
