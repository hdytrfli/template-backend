import morgan from 'morgan';
import base from 'pino';
import pinoHttp from 'pino-http';

import { env } from '@/libs/env';

const pino = base({
  name: env.APPLICATION,
  level: env.LEVEL,
});

const morganLogger = morgan('short');
const pinoLogger = pinoHttp({
  logger: pino,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const log = env.NODE_ENV === 'production' ? pino : console;
export const logger = env.NODE_ENV === 'production' ? pinoLogger : morganLogger;
