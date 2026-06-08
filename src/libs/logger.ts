import type { Request } from 'express';
import morgan from 'morgan';
import base from 'pino';
import pinoHttp from 'pino-http';

import { env } from '@/libs/env';

const pino = base({
  name: env.APPLICATION,
  level: env.LOG_LEVEL,
});

const pinoLogger = pinoHttp({
  logger: pino,
});

morgan.token('remote-ip', (req: Request) => req.ip);
morgan.token('method-lower', (req: Request) => req.method.toLowerCase());
morgan.format('system', '[system] :method-lower :url :status :response-time ms');
const morganLogger = morgan('system');

export const log = env.NODE_ENV === 'production' ? pino : console;
export const logger = env.NODE_ENV === 'production' ? pinoLogger : morganLogger;
