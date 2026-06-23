import { createPrivateKey, createPublicKey } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

import { UnauthorizedError } from '@/helpers/error';
import { env } from '@/libs/env';

export type TokenPayload = {
  sub: string;
  level: string;
};

type VerifiedToken = TokenPayload & JWTPayload;

export class JWTService {
  private privateKey;
  private publicKey;
  private accessExpires: string;
  private refreshExpires: string;

  constructor() {
    const privateKeyPath = env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = env.JWT_PUBLIC_KEY_PATH;

    const privateKeyFile = readFileSync(privateKeyPath);
    const publicKeyFile = readFileSync(publicKeyPath);

    this.privateKey = createPrivateKey(privateKeyFile);
    this.publicKey = createPublicKey(publicKeyFile);

    this.accessExpires = env.JWT_ACCESS_EXPIRES_IN;
    this.refreshExpires = env.JWT_REFRESH_EXPIRES_IN;
  }

  private async signAccessToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime(this.accessExpires)
      .sign(this.privateKey);
  }

  private async signRefreshToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime(this.refreshExpires)
      .sign(this.privateKey);
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.publicKey);
      return payload as unknown as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<VerifiedToken> {
    try {
      const { payload } = await jwtVerify(token, this.publicKey);
      return payload as VerifiedToken;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async generateTokens(userId: string, level: string) {
    const payload = { sub: userId, level };
    return {
      accessToken: await this.signAccessToken(payload),
      refreshToken: await this.signRefreshToken(payload),
    };
  }

  async verifyRefresh(token: string) {
    return this.verifyRefreshToken(token);
  }
}
