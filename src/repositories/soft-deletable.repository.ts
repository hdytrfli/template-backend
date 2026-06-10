import type { QueryFilter } from 'mongoose';
import type { Types } from 'mongoose';

import { log } from '@/libs/logger';
import { BaseRepository } from '@/repositories/base.repository';
import type { SoftDeleteable } from '@/types/model';

export class SoftDeletableRepository<T extends SoftDeleteable> extends BaseRepository<T> {
  async softDelete(filter: QueryFilter<T>, deletedBy: Types.ObjectId) {
    const doc = await this.model.findOneAndUpdate(
      filter,
      {
        $set: {
          deletedAt: new Date(),
          deletedBy,
        },
      },
      {
        returnDocument: 'after',
        lean: true,
      },
    );

    if (doc) log.info('[repository] %s soft-deleted with id %s', this.name, doc._id);
    return doc;
  }

  async hardDelete(filter: QueryFilter<T>) {
    const doc = await this.model.findOneAndDelete(filter);
    if (doc) log.info('[repository] %s hard-deleted with id %s', this.name, doc._id);
    return doc;
  }
}
