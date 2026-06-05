import cookieParser from 'cookie-parser';

import { env } from '@/libs/env';

/**
 * Cookie configuration
 */
export const cookie = cookieParser(env.COOKIE_SECRET);
