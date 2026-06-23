import { log } from '@/libs/logger';
import { messageQueue } from '@/services/messaging.service';

messageQueue.consume('notifications', 'user.welcome', async (data) => {
  log.info('[notifications] welcome %s - %s', data.name, data.email);
});
