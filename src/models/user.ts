import { Schema, model } from 'mongoose';

import type { PrivateUserDTO } from '@/models/types';

const schema = new Schema<PrivateUserDTO>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    lastLogin: { type: Date },
    createdBy: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      autopopulate: {
        select: 'username name email',
      },
    },
  },
  {
    autoIndex: false,
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      transform(_doc, ret) {
        const { password: _, ...rest } = ret;
        return rest;
      },
    },
  },
);

schema.index({ username: 1 }, { unique: true });

export const User = model<PrivateUserDTO>('User', schema);
