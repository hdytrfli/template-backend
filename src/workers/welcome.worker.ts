import { log } from '@/libs/logger';
import { QueueWorker } from '@/workers/base.worker';

new QueueWorker('welcome', async (job) => {
  const { email } = job.data;
  log.info('[worker] sending welcome to %s', email);
  job.updateProgress(100);
});
