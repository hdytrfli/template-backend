import type { QueryFilter, Model, UpdateQuery } from 'mongoose';

import { log } from '@/libs/logger';

export class BaseRepository<T> {
  constructor(protected model: Model<T>) {
    //
  }

  async index(filter: QueryFilter<T> = {}) {
    return this.model.find(filter);
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
