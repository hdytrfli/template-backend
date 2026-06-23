import { MongoDatabase } from '@/database/mongodb';
import { RabbitMQDatabase } from '@/database/rabbitmq';
import { env } from '@/libs/env';

export const database = new MongoDatabase(env.MONGODB_URI);
export const rabbit = new RabbitMQDatabase();
