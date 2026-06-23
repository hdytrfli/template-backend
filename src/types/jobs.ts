import type { UserDTO } from '@/types/model';

export type WelcomeJobData = {
  id: string;
  user: UserDTO;
};

export const QUEUE_REGISTER = {
  welcome: {} as WelcomeJobData,
};

export type QueueJobs = typeof QUEUE_REGISTER;
export type QueueKey = keyof typeof QUEUE_REGISTER;
