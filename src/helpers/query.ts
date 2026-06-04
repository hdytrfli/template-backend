import type { QueryFilter } from 'mongoose';

import { log } from '@/libs/logger';

type OperatorMapper = (value: string) => Record<string, unknown>;

const OPERATORS: Record<string, OperatorMapper> = {
  regex: (v) => ({ $regex: v, $options: 'i' }),
  ne: (v) => ({ $ne: v }),
  gte: (v) => ({ $gte: Number(v) }),
  gt: (v) => ({ $gt: Number(v) }),
  lte: (v) => ({ $lte: Number(v) }),
  lt: (v) => ({ $lt: Number(v) }),
  in: (v) => ({ $in: v.split(',') }),
};

/**
 * Build a Mongoose filter from bracket-notation query params (qs-parse output).
 *
 * - `?filter[name]=admin`           → `{ name: { $regex: 'admin', $options: 'i' } }`
 * - `?filter[name][regex]=admin`    → `{ name: { $regex: 'admin', $options: 'i' } }`
 * - `?filter[name][ne]=admin`       → `{ name: { $ne: 'admin' } }`
 * - `?filter[age][gte]=18`          → `{ age: { $gte: 18 } }`
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
      log.info(key, value);

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

  static clean<T>(query: QueryFilter<T>, allowed: string[] = []): QueryFilter<T> {
    if (allowed.length === 0) return query;

    const accept = new Set(allowed);
    const filtered = Object.entries(query).filter(([key]) => {
      const operator = key.startsWith('$');
      const allowed = accept.has(key);
      return !operator && allowed;
    });

    return Object.fromEntries(filtered) as QueryFilter<T>;
  }
}
