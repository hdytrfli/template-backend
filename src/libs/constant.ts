import { env } from '@/libs/env';

/* pagination constants */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MIN_PAGE = 1;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 100;

/* auth cookie option */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/api/v1/auth',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: env.NODE_ENV === 'production',
  signed: true,
};

/* Log time to live */
export const LOG_TTL = 60 * 60 * 24 * 90;
