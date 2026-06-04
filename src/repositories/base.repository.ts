import type { QueryFilter, Model, UpdateQuery } from 'mongoose';

import { Paginator } from '@/helpers/paginator';
import type { PaginatedResult } from '@/helpers/response';
import { log } from '@/libs/logger';
import type { PaginationParams } from '@/models/types';

export class BaseRepository<T> {
  constructor(protected model: Model<T>) {
    //
  }

  async index(filter: QueryFilter<T> = {}) {
    return this.model.find(filter);
  }

  async paginate(
    params: PaginationParams,
    filter: QueryFilter<T> = {},
  ): Promise<PaginatedResult<T>> {
    return Paginator.paginate(this.model, params, filter);
  }

  async create(data: Partial<T>) {
    const doc = await this.model.create(data);
    log.info({ id: doc._id }, `[${this.model.modelName}] created`);
    return doc;
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findOne(filter: QueryFilter<T>) {
    return this.model.findOne(filter);
  }

  async update(filter: QueryFilter<T>, data: UpdateQuery<T>) {
    const doc = await this.model.findOneAndUpdate(filter, data, { new: true });
    if (doc) log.info({ id: doc._id }, `[${this.model.modelName}] updated`);
    return doc;
  }

  async delete(filter: QueryFilter<T>) {
    const doc = await this.model.findOneAndDelete(filter);
    if (doc) log.info({ id: doc._id }, `[${this.model.modelName}] deleted`);
    return doc;
  }
}
