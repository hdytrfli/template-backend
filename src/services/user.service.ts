import { Hash } from '@/helpers/hash';
import { log } from '@/libs/logger';
import type { PrivateUserDTO, UserDTO } from '@/models/types';
import { User } from '@/models/user';

export const userService = {
  /**
   * Create new user
   */
  async create(data: PrivateUserDTO) {
    const user = await User.create({
      ...data,
      password: Hash.hash(data.password),
    });
    log.info({ userId: user._id }, '[user] created');
    return user;
  },

  /**
   * Find user by id
   */
  async findById(id: string) {
    return User.findById(id);
  },

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return User.findOne({ username });
  },

  /**
   * Get list of all users
   */
  async list() {
    return User.find();
  },

  /**
   * Update user by id
   */
  async update(id: string, data: Partial<UserDTO>) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (user) log.info({ userId: user._id }, '[user] updated');
    return user;
  },

  /**
   * Update user password
   */
  async updatePassword(id: string, password: string) {
    const user = await User.findByIdAndUpdate(id, { password: Hash.hash(password) }, { new: true });
    if (user) log.info({ userId: user._id }, '[user] password changed');
    return user;
  },

  /**
   * Delete user data
   */
  async delete(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (user) log.info({ userId: user._id }, '[user] deleted');
    return user;
  },
};
