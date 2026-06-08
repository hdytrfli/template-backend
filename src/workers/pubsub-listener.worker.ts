import { log } from '@/libs/logger';
import { pubsub } from '@/services/pubsub.service';

pubsub.subscribe('notifications', async (data, channel) => {
  log.info({ channel, data }, '[pubsub] received');
});
