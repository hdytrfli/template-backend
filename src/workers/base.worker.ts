import { Worker, type Job, type WorkerOptions } from 'bullmq';

import { redis } from '@/database';
import { log } from '@/libs/logger';
import type { QueueJobs, QueueKey } from '@/types/jobs';

export class QueueWorker<N extends QueueKey> {
  readonly worker: Worker<QueueJobs[N]>;

  constructor(
    name: N,
    handler: (job: Job<QueueJobs[N]>) => Promise<void>,
    options?: Omit<WorkerOptions, 'connection'>,
  ) {
    if (!redis.client) throw new Error('Redis client is not connected');
    this.worker = new Worker<QueueJobs[N]>(name, handler, {
      connection: redis.client as never,
      ...options,
    });

    this.worker.on('completed', (job) => {
      log.info('[%s] job with id %d completed', name, job.id);
    });

    this.worker.on('failed', (job, err) => {
      log.error(err, '[%s] job with id %d failed', name, job?.id);
    });

    const close = () => this.worker.close();

    process.on('SIGINT', close);
    process.on('SIGTERM', close);
  }
}
