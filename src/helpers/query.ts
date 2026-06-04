import type { QueryFilter } from 'mongoose';

/**
 * Cleanup query for mongoose, remove mongo operator and remove excluded fields
 */
export class QueryHelper {
  static clean<T>(query: QueryFilter<T>, fields: string[] = ['timestamp']): QueryFilter<T> {
    const excluded = new Set(fields);
    return Object.fromEntries(
      Object.entries(query).filter(function ([key]) {
        return QueryHelper.filter(key, excluded);
      }),
    ) as QueryFilter<T>;
  }

  private static filter(key: string, excluded: Set<string>): boolean {
    const isMongoOperator = key.startsWith('$');
    const isExcludedField = excluded.has(key);
    return !isMongoOperator && !isExcludedField;
  }
}
