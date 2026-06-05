import { Redis as RedisInstance } from 'ioredis';

import { KeyValue } from '@/database/contract';
import { env } from '@/libs/env';
import { log } from '@/libs/logger';

export class RedisDatabase extends KeyValue<RedisInstance> {
  readonly client: RedisInstance;

  constructor() {
    super();
    this.client = new RedisInstance(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }

  async connect(): Promise<void> {
    await this.client.ping();
    log.info('[redis] connected');
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
    log.info('[redis] disconnected');
  }

  async healthcheck(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (err) {
      log.error(err, '[redis] healthcheck failed');
      return false;
    }
  }
}
