import { Schema, model } from 'mongoose';

import { LOG_TTL } from '@/libs/constant';
import type { LogDTO } from '@/types/model';

const schema = new Schema<LogDTO>(
  {
    requestId: { type: String, required: true },
    requestMethod: { type: String, required: true },
    requestPath: { type: String, required: true },
    ipAddress: { type: String, required: true },
    statusCode: { type: Number, required: true },
    environment: { type: String, required: true },
    userAgent: { type: String },
    duration: { type: Number },
    user: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

schema.index({ createdAt: 1 }, { expireAfterSeconds: LOG_TTL });
schema.index({ requestId: 1 }, { unique: true });
schema.index({ statusCode: 1, createdAt: -1 });
schema.index({ createdAt: -1 });

export const ActivityLog = model<LogDTO>('Log', schema);
