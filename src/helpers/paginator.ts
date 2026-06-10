import type { Model, QueryFilter } from 'mongoose';

import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT, MIN_PAGE } from '@/libs/constant';
import type { PaginatedResult } from '@/types/response';
import type { FilterKeys, PaginationParams } from '@/types/util';

/**
 * Execute a paginated query on a Mongoose model.
 */
export class Paginator {
  static async paginate<T>(
    model: Model<T>,
    params: PaginationParams,
    filter: QueryFilter<T> = {},
    populate?: FilterKeys<T>[number] | FilterKeys<T>,
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(MIN_PAGE, params.page ?? DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, params.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    let query = model.find(filter).skip(skip).limit(limit);
    if (populate) query = query.populate(populate);

    const [data, total] = await Promise.all([
      query.lean().exec(),
      model.countDocuments(filter),
      //
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
