import type { QueryFilter, Model, UpdateQuery } from 'mongoose';

import { Paginator } from '@/helpers/paginator';
import { log } from '@/libs/logger';
import type { PaginatedResult } from '@/types/response';
import type { FilterKeys, PaginationParams, SortParams } from '@/types/util';

export class BaseRepository<T> {
  constructor(
    protected model: Model<T>,
    protected name: string = 'resource',
    protected populate?: FilterKeys<T>[number] | FilterKeys<T>,
  ) {}

  async index(filter: QueryFilter<T> = {}, sort?: SortParams) {
    let query = this.model.find(filter);
    if (sort) query = query.sort(sort);
    if (this.populate) query = query.populate(this.populate);
    return query.lean();
  }

  async paginate(
    params: PaginationParams,
    filter: QueryFilter<T> = {},
    sort?: SortParams,
  ): Promise<PaginatedResult<T>> {
    return Paginator.paginate({
      model: this.model,
      params,
      filter,
      sort,
      populate: this.populate,
    });
  }

  async create(data: Partial<T>) {
    const doc = await this.model.create(data);
    log.info('[repository] new %s created with id %s', this.name, doc._id);
    return doc;
  }

  async findById(id: string) {
    let query = this.model.findById(id);
    if (this.populate) query = query.populate(this.populate);
    return query.lean();
  }

  async findOne(filter: QueryFilter<T>) {
    let query = this.model.findOne(filter);
    if (this.populate) query = query.populate(this.populate);
    return query.lean();
  }

  async update(filter: QueryFilter<T>, data: UpdateQuery<T>) {
    const doc = await this.model.findOneAndUpdate(filter, data, {
      returnDocument: 'after',
    });
    if (doc) log.info('[repository] %s updated with id %s', this.name, doc._id);
    return doc;
  }

  async count(filter: QueryFilter<T> = {}) {
    return this.model.countDocuments(filter);
  }

  async delete(filter: QueryFilter<T>) {
    const doc = await this.model.findOneAndDelete(filter);
    if (doc) log.info('[repository] %s deleted with id %s', this.name, doc._id);
    return doc;
  }
}
