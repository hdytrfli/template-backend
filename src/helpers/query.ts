import type { QueryFilter } from 'mongoose';

import { OPERATORS } from '@/libs/constant';
import type { FilterKeys } from '@/types/util';

/**
 * Build a Mongoose filter from bracket-notation query params.
 */
export class QueryHelper {
  private static mapOperators(value: Record<string, unknown>) {
    return Object.entries(value).reduce<Record<string, unknown>>((acc, [op, val]) => {
      const mapper = OPERATORS[op];
      if (mapper && typeof val === 'string') Object.assign(acc, mapper(val));
      return acc;
    }, {});
  }

  static build<T>(filter: Record<string, unknown>): QueryFilter<T> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === 'string') {
        result[key] = { $regex: value, $options: 'i' };
        continue;
      }

      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      const mapped = this.mapOperators(value as Record<string, unknown>);
      if (Object.keys(mapped).length) result[key] = mapped;
    }

    return result as QueryFilter<T>;
  }

  static clean<T>(query: QueryFilter<T>, allowed: FilterKeys<T> = []): QueryFilter<T> {
    if (allowed.length === 0) return query;

    const accept = new Set<keyof T>(allowed);
    return Object.fromEntries(
      Object.entries(query).filter(([key]) => {
        const operator = key.startsWith('$');
        const allowed = accept.has(key as keyof T);
        return !operator && allowed;
      }),
    ) as QueryFilter<T>;
  }
}
