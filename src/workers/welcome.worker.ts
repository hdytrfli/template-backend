import { log } from '@/libs/logger';
import { QueueWorker } from '@/workers/base.worker';

const welcome = new QueueWorker('welcome', async (job) => {
  const { user } = job.data;
  log.info('[worker] sending welcome to %s', user.email);
  job.updateProgress(100);
});

welcome.worker.on('completed', (job) => {
  const { user } = job.data;
  log.info('[worker] completed sending welcom to %s', user.email);
});
