import { Queue } from 'bullmq';

import { redis } from '@/database';

export class QueueService {
  private static queues = new Map<string, Queue>();

  static get(name: string): Queue {
    let queue = this.queues.get(name);
    if (queue) return queue;

    queue = new Queue(name, {
      connection: redis.client as never,
    });

    this.queues.set(name, queue);
    return queue;
  }

  static async cleanup() {
    const values = this.queues.values();
    const promises = Array.from(values).map((queue) => {
      return queue.close();
    });
    await Promise.all(promises);
    this.queues.clear();
  }
}
