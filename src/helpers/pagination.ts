import type { Model, QueryFilter } from 'mongoose';

import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT, MIN_PAGE } from '@/helpers/constant';
import type { PaginatedResult } from '@/helpers/response';

export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * Execute a paginated query on a Mongoose model.
 */
export async function paginate<T>(
  model: Model<T>,
  params: PaginationParams,
  filter: QueryFilter<T> = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(MIN_PAGE, params.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, params.limit ?? DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
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
