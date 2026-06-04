import { Hash } from '@/helpers/hash';
import type { PrivateUserDTO } from '@/models/types';
import { User } from '@/models/user';
import { BaseRepository } from '@/repositories/base.repository';

export class UserRepository extends BaseRepository<PrivateUserDTO> {
  constructor() {
    super(User);
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
