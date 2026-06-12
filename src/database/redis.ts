import { Redis as RedisInstance } from 'ioredis';

import { env } from '@/libs/env';
import { log } from '@/libs/logger';

export class RedisDatabase {
  client?: RedisInstance;

  async connect(): Promise<void> {
    this.client = new RedisInstance(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    await this.client.ping();
    log.info('[redis] connected');
  }

  async disconnect(): Promise<void> {
    if (this.client) await this.client.quit();
    log.info('[redis] disconnected');
  }

  async healthcheck(): Promise<boolean> {
    try {
      if (this.client) await this.client.ping();
      return true;
    } catch (err) {
      log.error(err, '[redis] healthcheck failed');
      return false;
    }
  }
}
