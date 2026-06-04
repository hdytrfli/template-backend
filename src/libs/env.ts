import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as dotenv from 'dotenv';
import * as z from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: resolve(__dirname, '../../.env'),
  quiet: true,
});

const environtments = ['development', 'production', 'test'] as const;
const levels = ['debug', 'info', 'warn', 'error'] as const;

const validateMongoUri = (value: string) => {
  return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
};

const envSchema = z.object({
  APPLICATION: z.string().default('my-app'),
  BIND: z.string().default('0.0.0.0'),
  LEVEL: z.enum(levels).default('debug'),
  PORT: z.coerce.number().default(3000),
  ORIGIN: z.url().default('http://localhost:5173'),
  NODE_ENV: z.enum(environtments).default('development'),
  MONGODB_URI: z.string().refine(validateMongoUri, {
    message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://',
  }),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32).default('local-dev-refresh-secret-min-32-chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  const message = z.flattenError(error);
  console.error('Invalid environment variables');
  console.error(message);
  process.exit(1);
}

export const env = data;
