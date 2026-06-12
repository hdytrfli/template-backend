import type { ConsumeMessage } from 'amqplib';

import { rabbit } from '@/database';
import type { RabbitMQDatabase } from '@/database/rabbitmq';
import { log } from '@/libs/logger';
import type { Exchange, Messages } from '@/types/messages';

export type MessageHandler = (msg: ConsumeMessage) => Promise<void>;

export class MessageQueueService {
  constructor(private rabbit: RabbitMQDatabase) {}

  async publish<E extends Exchange, K extends keyof Messages[E]>(
    exchange: E,
    routingKey: K,
    data: Messages[E][K],
  ): Promise<void> {
    await this.rabbit.channel!.assertExchange(exchange as string, 'topic', { durable: true });

    const buffer = Buffer.from(JSON.stringify(data));
    this.rabbit.channel!.publish(exchange as string, routingKey as string, buffer, {
      persistent: true,
      contentType: 'application/json',
    });

    log.debug('[rabbitmq] published to %s.%s', exchange as string, routingKey as string);
  }

  async consume<E extends Exchange, K extends keyof Messages[E]>(
    exchange: E,
    routingKey: K,
    handler: (data: Messages[E][K]) => Promise<void>,
  ): Promise<void> {
    const queue = (exchange as string) + '.' + (routingKey as string);

    await this.rabbit.channel!.assertExchange(exchange as string, 'topic', { durable: true });
    await this.rabbit.channel!.assertQueue(queue, { durable: true });
    await this.rabbit.channel!.bindQueue(queue, exchange as string, routingKey as string);

    await this.rabbit.channel!.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString()) as Messages[E][K];
        await handler(data);
        this.rabbit.channel!.ack(msg);
      } catch (err) {
        log.error(err, '[rabbitmq] consumer error, nacking message');
        this.rabbit.channel!.nack(msg, false, true);
      }
    });

    log.info('[rabbitmq] listening to %s', queue);
  }
}

export const messageQueue = new MessageQueueService(rabbit);
