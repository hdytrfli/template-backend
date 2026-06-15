import { Schema, model } from 'mongoose';

import { softDeletePlugin } from '@/models/plugins/soft-delete';
import type { CompanyDTO } from '@/types/model';

const schema = new Schema<CompanyDTO>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true },
    country: {
      code: { type: String, required: true },
      label: { type: String, required: true },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

schema.plugin(softDeletePlugin);

schema.index({ name: 1 }, { unique: true });
schema.index({ name: 1, createdAt: -1 });

export const Company = model<CompanyDTO>('Company', schema);
