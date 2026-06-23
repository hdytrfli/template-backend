import { resolve } from 'node:path';

import * as dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config({
  quiet: true,
});

const environtments = ['development', 'production', 'test'] as const;
const levels = ['debug', 'info', 'warn', 'error'] as const;

const validateMongoUri = (value: string) => {
  return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
};

const currentDir = process.cwd();

const envSchema = z.object({
  BIND: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),
  APPLICATION: z.string().default('my-app'),
  LOG_LEVEL: z.enum(levels).default('debug'),
  ORIGIN: z.url().default('http://localhost:5173'),
  NODE_ENV: z.enum(environtments).default('development'),
  MONGODB_URI: z.string().refine(validateMongoUri, {
    message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://',
  }),
  COOKIE_SECRET: z.string().min(16).default('cookie-secret-min-16-chars!!'),
  COOKIE_DOMAIN: z.string().optional(),
  JWT_PRIVATE_KEY_PATH: z
    .string()
    .default('keys/private.pem')
    .transform((value) => resolve(currentDir, value)),
  JWT_PUBLIC_KEY_PATH: z
    .string()
    .default('keys/public.pem')
    .transform((value) => resolve(currentDir, value)),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ACCESS_TOKEN_NAME: z.string().default('Bearer'),
  JWT_REFRESH_TOKEN_NAME: z.string(),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  const message = z.flattenError(error);
  console.error('Invalid environment variables');
  console.error(message);
  process.exit(1);
}

export const env = data;
