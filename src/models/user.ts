import { Schema, model } from 'mongoose';

import type { PrivateUserDTO } from '@/types/model';

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
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
  },
  {
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
