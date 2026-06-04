import mongoose from 'mongoose';

import { Database } from '@/database/contract';
import { log } from '@/libs/logger';

export class MongoDatabase extends Database {
  constructor(uri: string) {
    super(uri);
    this.registerEventListeners();
  }

  registerEventListeners(): void {
    mongoose.connection.on('connected', () => {
      log.info('[database] MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      log.error(err, '[database] MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      log.warn('[database] MongoDB disconnected');
    });
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.uri, {
      serverSelectionTimeoutMS: 5000,
      sanitizeFilter: true,
    });
    mongoose.set('strictQuery', true);
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  async healthcheck(): Promise<boolean> {
    try {
      if (!mongoose.connection.db) return false;
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (err) {
      log.error(err, '[database] MongoDB healthcheck failed');
      return false;
    }
  }
}
