import { log } from '@/libs/logger';

export type MailAddress = {
  name: string;
  address: string;
};

export type Attachment = {
  filename: string;
  content: Buffer;
};

export type MailOptions = {
  to: MailAddress;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
};

export class MailService {
  async send(options: MailOptions): Promise<void> {
    log.info('[mail] sending %s to %s', options.subject, options.to.address);
  }
}
