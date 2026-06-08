import { Redis } from 'ioredis';

import { redis } from '@/database';
import { env } from '@/libs/env';
import { log } from '@/libs/logger';
import type { PubSubChannels } from '@/types/pubsub';

type Handler<T> = (message: T, channel: string) => void | Promise<void>;
type Channel = keyof PubSubChannels;

export class PubSubService {
  private sub: Redis | null = null;
  private handlers = new Map<string, Set<Handler<unknown>>>();

  private getSubscriber(): Redis {
    if (!this.sub) {
      this.sub = new Redis(env.REDIS_URL);
      this.sub.on('message', (channel, message) => this.dispatch(channel, message));
      this.sub.on('error', (err) => log.error(err, '[pubsub] subscriber error'));
    }

    return this.sub;
  }

  private addSubscription(channel: string): Promise<void> {
    if (this.handlers.has(channel)) return Promise.resolve();
    this.handlers.set(channel, new Set());

    return this.getSubscriber()
      .subscribe(channel)
      .then(() => {
        log.info({ channel }, '[pubsub] subscribed');
      });
  }

  private removeSubscription(channel: string): Promise<void> {
    if (!this.handlers.has(channel)) return Promise.resolve();
    this.handlers.delete(channel);

    if (!this.sub) return Promise.resolve();
    return this.sub.unsubscribe(channel).then(() => log.info({ channel }, '[pubsub] unsubscribed'));
  }

  private dispatch(channel: string, message: string): void {
    const handlers = this.handlers.get(channel);
    if (!handlers) return;

    let parsed: unknown = message;
    try {
      parsed = JSON.parse(message);
    } catch {}

    handlers.forEach((handle) => {
      const response = handle(parsed, channel);
      Promise.resolve(response).catch((err) => {
        log.error(err, '[pubsub] handler error');
      });
    });
  }

  async publish<C extends Channel>(channel: C, message: PubSubChannels[C]): Promise<number> {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    return redis.client.publish(channel, payload);
  }

  async subscribe<C extends Channel>(
    channel: C,
    handler: Handler<PubSubChannels[C]>,
  ): Promise<void> {
    await this.addSubscription(channel);
    const handlers = this.handlers.get(channel);
    if (handlers) handlers.add(handler as Handler<unknown>);
  }

  async unsubscribe<C extends Channel>(
    channel: C,
    handler?: Handler<PubSubChannels[C]>,
  ): Promise<void> {
    const handlers = this.handlers.get(channel);
    if (!handlers) return;
    if (handler) handlers.delete(handler as Handler<unknown>);
    if (!handler || handlers.size === 0) await this.removeSubscription(channel);
  }

  async disconnect(): Promise<void> {
    if (this.sub) {
      await this.sub.quit();
      this.sub = null;
    }

    this.handlers.clear();
    log.info('[pubsub] disconnected');
  }
}

export const pubsub = new PubSubService();
