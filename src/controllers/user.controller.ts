import type { Request } from 'express';
import * as z from 'zod';

import { NotFoundError } from '@/helpers/error';
import type { AppResponse } from '@/helpers/response';
import type { PrivateUserDTO, UserDTO } from '@/models/types';
import { userService } from '@/services/user.service';

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
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const paramsSchema = z.object({
  id: z.string().length(24),
});

export class UserController {
  /**
   * Create a new user
   */
  async create(req: Request, res: AppResponse<UserDTO>) {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data as PrivateUserDTO);

    res.status(201).json({
      success: true,
      data: user,
    });
  }

  /**
   * Find a user by ID
   */
  async findById(req: Request, res: AppResponse<UserDTO>) {
    const data = paramsSchema.parse(req.params);

    const user = await userService.findById(data.id);
    if (!user) throw new NotFoundError('User');

    res.json({
      success: true,
      data: user,
    });
  }

  /**
   * List all users
   */
  async list(_req: Request, res: AppResponse<UserDTO[]>) {
    const users = await userService.list();

    res.json({
      success: true,
      data: users,
    });
  }

  /**
   * Update a user by ID
   */
  async update(req: Request, res: AppResponse<UserDTO>) {
    const params = paramsSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);

    const user = await userService.update(params.id, data as UserDTO);
    if (!user) throw new NotFoundError('User');

    res.json({
      success: true,
      data: user,
    });
  }

  /**
   * Delete a user by ID
   */
  async delete(req: Request, res: AppResponse<null>) {
    const data = paramsSchema.parse(req.params);

    const user = await userService.delete(data.id);
    if (!user) throw new NotFoundError('User');

    res.json({
      success: true,
      message: 'User deleted',
    });
  }
}

export const userController = new UserController();
