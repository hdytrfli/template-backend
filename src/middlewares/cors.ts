import base from 'cors';

import { env } from '@/libs/env';

/**
 * CORS middleware configuration
 */
export const cors = base({
  origin: env.ORIGIN,
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
