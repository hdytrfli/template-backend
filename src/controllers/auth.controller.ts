import type { Request } from 'express';
import { Types } from 'mongoose';
import * as z from 'zod';

import { ConflictError, NotFoundError, UnauthorizedError } from '@/helpers/error';
import { Hash } from '@/helpers/hash';
import { COOKIE_OPTIONS } from '@/libs/constant';
import { env } from '@/libs/env';
import { UserRepository } from '@/repositories/user.repository';
import { JWTService } from '@/services/jwt.service';
import type { LoginData, AuthToken, UserDTO } from '@/types/model';
import type { AppResponse } from '@/types/response';

const registerSchema = z.strictObject({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  email: z.email().optional(),
  phone: z.string().optional(),
});

const changePasswordSchema = z.strictObject({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128),
});

const loginSchema = registerSchema.pick({
  username: true,
  password: true,
});

const updateProfileSchema = registerSchema.omit({
  username: true,
  password: true,
});

const paramsSchema = z.object({
  id: z
    .string()
    .length(24)
    .refine((value) => {
      return Types.ObjectId.isValid(value);
    }),
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

    const tokens = await this.auth.generateTokens(user.id, user.level);

    res.cookie(env.JWT_REFRESH_TOKEN_NAME, tokens.refreshToken, COOKIE_OPTIONS);
    return res.status(201).json({
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  };

  login = async (req: Request, res: AppResponse<LoginData>) => {
    const { username, password } = loginSchema.parse(req.body);

    const user = await this.respository.findByUsername(username);
    if (!user) throw new NotFoundError('User');

    const matched = Hash.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Invalid credentials');

    const tokens = await this.auth.generateTokens(user.id, user.level);
    await this.respository.update({ _id: user.id }, { lastLogin: new Date() });

    res.cookie(env.JWT_REFRESH_TOKEN_NAME, tokens.refreshToken, COOKIE_OPTIONS);
    return res.json({
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  };

  refresh = async (req: Request, res: AppResponse<AuthToken>) => {
    const refreshToken = req.signedCookies?.[env.JWT_REFRESH_TOKEN_NAME];
    if (!refreshToken) throw new UnauthorizedError('No refresh token');

    const payload = await this.auth.verifyRefreshToken(refreshToken);
    const tokens = await this.auth.generateTokens(payload.sub, payload.level);

    res.cookie(env.JWT_REFRESH_TOKEN_NAME, tokens.refreshToken, COOKIE_OPTIONS);
    return res.json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  };

  profile = async (req: Request, res: AppResponse<UserDTO>) => {
    const user = await this.respository.findById(req.user.sub);
    if (!user) throw new NotFoundError('User');
    return res.json({ success: true, data: user });
  };

  logout = async (_req: Request, res: AppResponse<null>) => {
    res.clearCookie(env.JWT_REFRESH_TOKEN_NAME, COOKIE_OPTIONS);

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
