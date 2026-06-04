import type { QueryFilter, Model, UpdateQuery } from 'mongoose';

import { Paginator } from '@/helpers/paginator';
import type { PaginatedResult } from '@/helpers/response';
import { log } from '@/libs/logger';
import type { FilterKeys, PaginationParams } from '@/models/types';

export class BaseRepository<T> {
  constructor(
    protected model: Model<T>,
    protected name: string = 'resource',
    protected populate?: FilterKeys<T>[number] | FilterKeys<T>,
  ) {}

  async index(filter: QueryFilter<T> = {}) {
    let query = this.model.find(filter);
    if (this.populate) query = query.populate(this.populate);
    return query;
  }

  async paginate(
    params: PaginationParams,
    filter: QueryFilter<T> = {},
  ): Promise<PaginatedResult<T>> {
    return Paginator.paginate(this.model, params, filter, this.populate);
  }

  async create(data: Partial<T>) {
    const doc = await this.model.create(data);
    log.info('[repository] new %s created with id %s', this.name, doc._id);
    return doc;
  }

  async findById(id: string) {
    let query = this.model.findById(id);
    if (this.populate) query = query.populate(this.populate);
    return query;
  }

  async findOne(filter: QueryFilter<T>) {
    let query = this.model.findOne(filter);
    if (this.populate) query = query.populate(this.populate);
    return query;
  }

  async update(filter: QueryFilter<T>, data: UpdateQuery<T>) {
    const doc = await this.model.findOneAndUpdate(filter, data, { new: true });
    if (doc) log.info('[repository] %s updated with id %s', this.name, doc._id);
    return doc;
  }

  async delete(filter: QueryFilter<T>) {
    const doc = await this.model.findOneAndDelete(filter);
    if (doc) log.info('[repository] %s deleted with id %s', this.name, doc._id);
    return doc;
  }
}
