import { Schema, model } from 'mongoose';

import type { CompanyDTO } from '@/types/model';

const schema = new Schema<CompanyDTO>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    companyType: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

schema.index({ name: 1 }, { unique: true });

export const Company = model<CompanyDTO>('Company', schema);
