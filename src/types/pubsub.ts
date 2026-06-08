export type NotificationData = {
  text: string;
  timestamp: string;
};

export const PUBSUB_CHANNELS = {
  notifications: {} as NotificationData,
};

export type PubSubChannels = typeof PUBSUB_CHANNELS;
