import { Schema } from 'mongoose';
import type { Query } from 'mongoose';

export const softDeletePlugin = (schema: Schema) => {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });

  schema.pre(/^find/, function (this: Query<any, any>) {
    this.where({
      deletedAt: null,
    });
  });

  schema.pre('aggregate', function () {
    this.pipeline().unshift({
      $match: {
        deletedAt: null,
      },
    });
  });
};
