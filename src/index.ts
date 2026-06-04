import express, { json } from 'express';
import helmet from 'helmet';

import { database } from '@/database';
import { env } from '@/libs/env';
import { logger, log } from '@/libs/logger';
import { catchall } from '@/middlewares/catch-all';
import { catcherr } from '@/middlewares/catch-error';
import { cors } from '@/middlewares/cors';
import { reqid } from '@/middlewares/reqid';
import { timer } from '@/middlewares/timer';
import v1 from '@/routers/v1/index.route';

const app = express();
const parser = json();

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
  await database.disconnect();
  process.exit(0);
});
