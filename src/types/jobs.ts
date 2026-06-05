import type { MailRecipient } from '@/types/model';

export type MailJobData = {
  type: string;
  template: string;
  recipients: MailRecipient[];
  subject: string;
  body: string;
};

export type WelcomeJobData = MailRecipient;

export const QUEUE_REGISTER = {
  mail: {} as MailJobData,
  welcome: {} as WelcomeJobData,
};

export type QueueJobs = typeof QUEUE_REGISTER;
export type QueueKey = keyof typeof QUEUE_REGISTER;
