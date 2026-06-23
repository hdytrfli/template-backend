import { MongoDatabase } from '@/database/mongodb';
import { RedisDatabase } from '@/database/redis';
import { env } from '@/libs/env';

export const database = new MongoDatabase(env.MONGODB_URI);
export const redis = new RedisDatabase(env.REDIS_URI);
