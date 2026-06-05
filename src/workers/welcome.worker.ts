import { log } from '@/libs/logger';
import { socket } from '@/services/socket.service';
import { QueueWorker } from '@/workers/base.worker';

const welcome = new QueueWorker('welcome', async (job) => {
  const { email } = job.data;
  log.info('[worker] sending welcome to %s', email);
  job.updateProgress(100);
});

welcome.worker.on('completed', (job) => {
  const { name } = job.data;
  socket.client.emit('notification', {
    title: 'Welcome!',
    message: 'Welcome aboard, ' + name,
  });
});
