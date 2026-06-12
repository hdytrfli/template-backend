import { createServer } from 'http';

import express, { json } from 'express';
import helmet from 'helmet';

import { database, rabbit, redis } from '@/database';
import { env } from '@/libs/env';
import { logger, log } from '@/libs/logger';
import { catchall } from '@/middlewares/catch-all';
import { catcherr } from '@/middlewares/catch-error';
import { cookie } from '@/middlewares/cookie';
import { cors } from '@/middlewares/cors';
import { reqid } from '@/middlewares/reqid';
import { timer } from '@/middlewares/timer';
import v1 from '@/routers/v1/index.route';
import { QueueService } from '@/services/queue.service';
import { socket } from '@/services/socket.service';
const app = express();
const parser = json();

app.use(parser);
app.use(cookie);
app.use(reqid);
app.use(cors);
app.use(
  helmet({
    xContentTypeOptions: true,
    contentSecurityPolicy: true,
    hsts: env.NODE_ENV === 'production',
  }),
);
app.use(logger);
app.use(timer);

app.set('query parser', 'extended');
app.use('/api/v1', v1);
app.use(catchall);
app.use(catcherr);

const server = createServer(app);

async function main() {
  await database.connect();
  await rabbit.connect();
  await redis.connect();

  await import('@/loaders/workers');
  await import('@/loaders/consumers');

  socket.connect(server);
  server.listen(env.PORT, env.BIND, () => {
    log.info('[system] server is running on http://%s:%d', env.BIND, env.PORT);
  });
}

main().catch((err) => {
  log.error(err, '[system] failed to start server');
  process.exit(1);
});

process.on('SIGINT', async () => {
  log.info('[system] shutting down...');
  await QueueService.cleanup();

  const promises = [
    database.disconnect(),
    rabbit.disconnect(),
    redis.disconnect(),
    socket.disconnect(),
    //
  ];

  await Promise.all(promises);
  process.exit(0);
});
