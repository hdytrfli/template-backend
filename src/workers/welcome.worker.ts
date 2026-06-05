import { Worker } from 'bullmq';

import { redis } from '@/database';
import { log } from '@/libs/logger';

type WelcomeData = {
  userId: string;
  username: string;
  email?: string;
};

export const worker = new Worker<WelcomeData>(
  'welcome',
  async (job) => {
    const { userId, username, email } = job.data;
    log.info('[worker] sending welcome to %s (%s) — %s', username, email ?? 'no email', userId);
    job.updateProgress(100);
  },
  { connection: redis.client as never },
);

worker.on('completed', (job) => {
  log.info('[worker] welcome job %d completed', job.id);
});

worker.on('failed', (job, err) => {
  log.error(err, '[worker] welcome job %d failed', job?.id);
});

process.on('SIGINT', () => worker.close());
process.on('SIGTERM', () => worker.close());
