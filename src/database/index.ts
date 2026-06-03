import { MongoDatabase } from '@/database/mongodb';
import { env } from '@/libs/env';

export const database = new MongoDatabase(env.MONGODB_URI);
