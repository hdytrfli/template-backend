import { log } from '@/libs/logger';
import { getPercentage as percentage } from '@/libs/utils';
import { mailService } from '@/services/mail.service';
import { QueueWorker } from '@/workers/base.worker';

new QueueWorker(
  'mail',
  async (job) => {
    const { recipients, subject, body } = job.data;
    const filtered = recipients.filter((recipient) => recipient.email);

    filtered.forEach(async (recipient, index) => {
      try {
        await mailService.send({
          to: {
            address: recipient.email,
            name: recipient.name,
          },
          subject,
          text: body,
        });
        const progress = percentage(index, recipients.length);
        await job.updateProgress(progress);
      } catch (err) {
        log.error(err, '[mail] failed to send to %s', recipient.email);
      }
    });
  },
  { concurrency: 5 },
);
