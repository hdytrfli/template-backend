import { Queue, type JobsOptions } from 'bullmq';

import { redis } from '@/database';
import type { QueueJobs } from '@/types/jobs';

type QueueHandle<J> = {
  add(name: string, data: J, opts?: JobsOptions): ReturnType<Queue['add']>;
  close(): Promise<void>;
};

export class QueueService {
  private static instances = new Map<string, Queue>();

  static get<N extends keyof QueueJobs>(name: N): QueueHandle<QueueJobs[N]> {
    let queue = this.instances.get(name);

    if (!queue) {
      queue = new Queue(name, { connection: redis.client as never });
      this.instances.set(name, queue);
    }

    return {
      add: (name, data, opts) => queue!.add(name, data, opts),
      close: () => queue!.close(),
    };
  }

  static async cleanup() {
    await Promise.all(Array.from(this.instances.values()).map((q) => q.close()));
    this.instances.clear();
  }
}
