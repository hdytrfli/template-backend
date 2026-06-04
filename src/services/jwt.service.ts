import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

import { UnauthorizedError } from '@/helpers/error';
import { env } from '@/libs/env';

export type TokenPayload = {
  sub: string;
  level: string;
};

type VerifiedToken = TokenPayload & JwtPayload;

export class JWTService {
  private secret = env.JWT_SECRET;
  private refreshSecret = env.JWT_REFRESH_SECRET;
  private accessExpires = env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'];
  private refreshExpires = env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

  private signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload as object, this.secret, {
      expiresIn: this.accessExpires,
    });
  }

  private signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload as object, this.refreshSecret, {
      expiresIn: this.refreshExpires,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  verifyRefreshToken(token: string): VerifiedToken {
    try {
      return jwt.verify(token, this.refreshSecret) as VerifiedToken;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  generateTokens(userId: string, level: string) {
    const payload = { sub: userId, level };
    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: this.signRefreshToken(payload),
    };
  }

  verifyRefresh(token: string) {
    return this.verifyRefreshToken(token);
  }
}
