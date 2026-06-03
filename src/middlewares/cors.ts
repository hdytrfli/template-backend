import base from 'cors';

import { env } from '@/libs/env';

/**
 * CORS middleware configuration
 * Allows cross-origin requests from the specified origin with defined methods and headers
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
