import type { Request } from 'express';
import * as z from 'zod';

import { NotFoundError, UnauthorizedError } from '@/helpers/error';
import { Hash } from '@/helpers/hash';
import type { AppResponse } from '@/helpers/response';
import type { UserDTO } from '@/models/types';
import { userService } from '@/services/user.service';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const paramsSchema = z.object({
  id: z.string().length(24),
});

export class AuthController {
  /**
   * Register a new user account
   */
  async register(req: Request, res: AppResponse<UserDTO>) {
    const data = registerSchema.parse(req.body);
    const user = await userService.create({
      username: data.username,
      password: data.password,
      name: data.name,
      level: 'user',
      email: data.email,
      phone: data.phone,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  }

  /**
   * Authenticate user and return profile
   */
  async login(req: Request, res: AppResponse<UserDTO>) {
    const { username, password } = loginSchema.parse(req.body);

    const user = await userService.findByUsername(username);
    if (!user) throw new NotFoundError('User');

    const matched = Hash.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Invalid credentials');

    res.json({
      success: true,
      data: user,
    });
  }

  /**
   * Change authenticated user's password
   */
  async changePassword(req: Request, res: AppResponse<null>) {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id } = paramsSchema.parse(req.params);

    const target = await userService.findById(id);
    if (!target) throw new NotFoundError('User');

    const isMatch = Hash.compare(currentPassword, target.password);
    if (!isMatch) throw new UnauthorizedError('Current password is incorrect');

    await userService.updatePassword(id, newPassword);
    res.json({
      success: true,
      message: 'Password changed',
    });
  }

  /**
   * Update profile fields (name, email, phone)
   */
  async updateProfile(req: Request, res: AppResponse<UserDTO>) {
    const data = updateProfileSchema.parse(req.body);
    const { id } = paramsSchema.parse(req.params);

    const user = await userService.update(id, data);
    if (!user) throw new NotFoundError('User');

    res.json({
      success: true,
      data: user,
    });
  }
}

export const authController = new AuthController();
