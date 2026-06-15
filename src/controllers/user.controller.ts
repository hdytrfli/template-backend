import * as z from 'zod';

import { BaseController } from '@/controllers/base.controller';
import { UserRepository } from '@/repositories/user.repository';
import type { PrivateUserDTO } from '@/types/model';

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  level: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().optional(),
});

const updateUserSchema = createUserSchema
  .omit({
    username: true,
    password: true,
  })
  .partial();

/**
 * Controller to handle user related data.
 */
export class UserController extends BaseController<
  PrivateUserDTO,
  z.infer<typeof createUserSchema>,
  z.infer<typeof updateUserSchema>
> {
  constructor() {
    super(
      new UserRepository(),
      createUserSchema,
      updateUserSchema,
      ['name', 'email'],
      ['name', 'username', 'level', 'createdAt'],
    );
  }
}
