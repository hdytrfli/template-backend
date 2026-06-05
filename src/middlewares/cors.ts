import base from 'cors';

import { env } from '@/libs/env';

/**
 * Cross origin resource configuration
 */
export const cors = base({
  origin: env.ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Accept',
    'Authorization',
    'Content-Disposition',
    'Content-Type',
    'User-Agent',
    'X-Requested-With',
  ],
});
