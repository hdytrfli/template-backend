import type { Request } from 'express';
import * as z from 'zod';

import { NotFoundError, UnauthorizedError } from '@/helpers/error';
import { Hash } from '@/helpers/hash';
import type { AppResponse } from '@/helpers/response';
import type { UserDTO } from '@/models/types';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';

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

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
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

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type LoginData = TokenPair & {
  user: UserDTO;
};

export class AuthController {
  private auth = new AuthService();
  private users = new UserRepository();

  /**
   * Register a new user account
   */
  async register(req: Request, res: AppResponse<LoginData>) {
    const data = registerSchema.parse(req.body);
    const user = await this.users.create({
      username: data.username,
      password: data.password,
      name: data.name,
      level: 'user',
      email: data.email,
      phone: data.phone,
    });

    const tokens = this.auth.generateTokens(user.id, user.level);

    res.status(201).json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  }

  /**
   * Authenticate user and return tokens
   */
  async login(req: Request, res: AppResponse<LoginData>) {
    const { username, password } = loginSchema.parse(req.body);

    const user = await this.users.findByUsername(username);
    if (!user) throw new NotFoundError('User');

    const matched = Hash.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Invalid credentials');

    const tokens = this.auth.generateTokens(user.id, user.level);

    res.json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  }

  /**
   * Issue a new access token using a valid refresh token
   */
  async refresh(req: Request, res: AppResponse<TokenPair>) {
    const { refreshToken } = refreshSchema.parse(req.body);

    let payload;
    try {
      payload = this.auth.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokens = this.auth.generateTokens(payload.sub, payload.level);

    res.json({
      success: true,
      data: tokens,
    });
  }

  /**
   * Logout (no-op without server-side token storage)
   */
  async logout(_req: Request, res: AppResponse<null>) {
    res.json({
      success: true,
      message: 'Logged out',
    });
  }

  /**
   * Change user password
   */
  async changePassword(req: Request, res: AppResponse<null>) {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id } = paramsSchema.parse(req.params);

    const target = await this.users.findById(id);
    if (!target) throw new NotFoundError('User');

    const isMatch = Hash.compare(currentPassword, target.password);
    if (!isMatch) throw new UnauthorizedError('Current password is incorrect');

    await this.users.updatePassword(id, newPassword);

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

    const user = await this.users.update({ _id: id }, data);
    if (!user) throw new NotFoundError('User');

    res.json({
      success: true,
      data: user,
    });
  }
}

export const authController = new AuthController();
