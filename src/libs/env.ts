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
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32).default('local-dev-refresh-secret-min-32-chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ACCESS_TOKEN_NAME: z.string().default('Bearer'),
  COOKIE_SECRET: z.string().min(16).default('cookie-secret-min-16-chars!!'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_REFRESH_KEY: z.string(),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@127.0.0.1:5672'),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  const message = z.flattenError(error);
  console.error('Invalid environment variables');
  console.error(message);
  process.exit(1);
}

export const env = data;
