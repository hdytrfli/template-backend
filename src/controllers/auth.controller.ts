import type { Request } from 'express';
import * as z from 'zod';

import { ConflictError, NotFoundError, UnauthorizedError } from '@/helpers/error';
import { Hash } from '@/helpers/hash';
import { UserRepository } from '@/repositories/user.repository';
import { JWTService } from '@/services/jwt.service';
import { QueueService } from '@/services/queue.service';
import type { LoginData, TokenPair, UserDTO } from '@/types/model';
import type { AppResponse } from '@/types/response';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  email: z.email().optional(),
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

/**
 * Controller to handle authentication related data.
 */
export class AuthController {
  private auth = new JWTService();
  private respository = new UserRepository();

  register = async (req: Request, res: AppResponse<LoginData>) => {
    const data = registerSchema.parse(req.body);

    const check = await this.respository.findByUsername(data.username);
    if (check) throw new ConflictError();

    const user = await this.respository.create({
      username: data.username,
      password: data.password,
      name: data.name,
      level: 'user',
      email: data.email,
      phone: data.phone,
    });

    const tokens = this.auth.generateTokens(user.id, user.level);

    if (user.email) {
      await QueueService.get('welcome').add('send-welcome', {
        name: user.name,
        email: user.email,
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  };

  login = async (req: Request, res: AppResponse<LoginData>) => {
    const { username, password } = loginSchema.parse(req.body);

    const user = await this.respository.findByUsername(username);
    if (!user) throw new NotFoundError('User');

    const matched = Hash.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Invalid credentials');

    const tokens = this.auth.generateTokens(user.id, user.level);
    await this.respository.update({ _id: user.id }, { lastLogin: new Date() });

    return res.json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  };

  refresh = async (req: Request, res: AppResponse<TokenPair>) => {
    const { refreshToken } = refreshSchema.parse(req.body);

    const payload = this.auth.verifyAccessToken(refreshToken);
    const tokens = this.auth.generateTokens(payload.sub, payload.level);

    return res.json({
      success: true,
      data: tokens,
    });
  };

  logout = async (_req: Request, res: AppResponse<null>) => {
    return res.json({
      success: true,
      message: 'Logged out',
    });
  };

  changePassword = async (req: Request, res: AppResponse<null>) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id } = paramsSchema.parse(req.params);

    const target = await this.respository.findById(id);
    if (!target) throw new NotFoundError('User');

    const matched = Hash.compare(currentPassword, target.password);
    if (!matched) throw new UnauthorizedError('Current password is incorrect');

    await this.respository.updatePassword(id, newPassword);
    return res.json({
      success: true,
      message: 'Password changed',
    });
  };

  updateProfile = async (req: Request, res: AppResponse<UserDTO>) => {
    const data = updateProfileSchema.parse(req.body);
    const { id } = paramsSchema.parse(req.params);

    const user = await this.respository.update({ _id: id }, data);
    if (!user) throw new NotFoundError('User');

    return res.json({
      success: true,
      data: user,
    });
  };
}

export const authController = new AuthController();
