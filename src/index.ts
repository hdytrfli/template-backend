import express, { json } from 'express';
import helmet from 'helmet';

import { database, redis } from '@/database';
import { env } from '@/libs/env';
import { logger, log } from '@/libs/logger';
import { catchall } from '@/middlewares/catch-all';
import { catcherr } from '@/middlewares/catch-error';
import { cors } from '@/middlewares/cors';
import { reqid } from '@/middlewares/reqid';
import { timer } from '@/middlewares/timer';
import v1 from '@/routers/v1/index.route';
import { QueueService } from '@/services/queue.service';
import '@/workers/mail.worker';
import '@/workers/welcome.worker';

const app = express();
const parser = json();

app.set('query parser', 'extended');
app.use(parser);
app.use(reqid);
app.use(cors);
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);
app.use(logger);
app.use(timer);

app.use('/api/v1', v1);
app.use(catchall);
app.use(catcherr);

async function main() {
  await database.connect();
  await redis.connect();
  app.listen(env.PORT, env.BIND, () => {
    log.info('[system] server is running on http://%s:%d', env.BIND, env.PORT);
  });
}

main().catch((err) => {
  log.error(err, '[system] failed to start server');
  process.exit(1);
});

process.on('SIGINT', async () => {
  log.info('[system] shutting down...');

  const promises = [
    database.disconnect(),
    QueueService.cleanup(),
    redis.disconnect(),
    //
  ];

  await Promise.all(promises);
  process.exit(0);
});
