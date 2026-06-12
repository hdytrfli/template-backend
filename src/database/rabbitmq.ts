import type { Channel, ChannelModel } from 'amqplib';
import { connect } from 'amqplib';

import { env } from '@/libs/env';
import { log } from '@/libs/logger';

export class RabbitMQDatabase {
  model?: ChannelModel;
  channel?: Channel;

  registerEventListeners(channel: Channel): void {
    channel.on('close', () => log.warn('[rabbitmq] channel closed'));
    channel.on('error', (err: Error) => log.error(err, '[rabbitmq] channel error'));
  }

  async connect(): Promise<void> {
    this.model = await connect(env.RABBITMQ_URL);
    this.channel = await this.model.createChannel();

    log.info('[rabbitmq] connected');
    if (this.channel) this.registerEventListeners(this.channel);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
    } catch (err) {
      log.error(err, '[rabbitmq] disconnect error');
    }

    if (this.model) await this.model.close();
    log.info('[rabbitmq] disconnected');
  }

  async healthcheck(): Promise<boolean> {
    try {
      return this.model !== undefined;
    } catch {
      return false;
    }
  }
}
