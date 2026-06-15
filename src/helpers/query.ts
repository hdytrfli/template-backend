import type { QueryFilter } from 'mongoose';

import { OPERATORS } from '@/libs/constant';
import type { FilterKeys, SortParams } from '@/types/util';

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

  static parseFilter<T>(filter: Record<string, unknown>): QueryFilter<T> {
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

  static parseSort(sort?: string): SortParams | undefined {
    if (!sort) return undefined;

    return sort.split(',').reduce<SortParams>((acc, field) => {
      const trimmed = field.trim();
      if (!trimmed) return acc;
      acc[trimmed.replace(/^-/, '')] = trimmed.startsWith('-') ? -1 : 1;
      return acc;
    }, {});
  }

  static sanitizeSort(sort?: SortParams, allowed: string[] = []): SortParams | undefined {
    if (!sort || allowed.length === 0) return sort;
    return Object.fromEntries(
      Object.entries(sort).filter(([key]) =>
        allowed.some((a) => key === a || key.startsWith(a + '.')),
      ),
    );
  }

  static sanitizeFilter<T>(query: QueryFilter<T>, allowed: FilterKeys<T> = []): QueryFilter<T> {
    if (allowed.length === 0) return query;

    return Object.fromEntries(
      Object.entries(query).filter(([key]) => {
        if (key.startsWith('$')) return false;
        return allowed.some((a) => key === a || key.startsWith(a + '.'));
      }),
    ) as QueryFilter<T>;
  }
}
