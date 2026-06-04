import * as z from 'zod';

import { BaseController } from '@/controllers/base.controller';
import type { PrivateUserDTO } from '@/models/types';
import { UserRepository } from '@/repositories/user.repository';

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  level: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  level: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
});

export class UserController extends BaseController<
  PrivateUserDTO,
  z.infer<typeof createUserSchema>,
  z.infer<typeof updateUserSchema>
> {
  constructor() {
    super(new UserRepository(), createUserSchema, updateUserSchema);
  }
}
