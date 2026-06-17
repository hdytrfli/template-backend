type IsNestedObject<T> = T extends Record<string, unknown> ? true : false;
type DotPath<Parent extends string, Child extends string> = `${Parent}.${Child}`;
type KeysFor<T, K extends keyof T & string> =
  IsNestedObject<T[K]> extends true ? K | DotPath<K, NestedKeys<T[K]>> : K;
type NestedKeys<T> = { [K in keyof T & string]: KeysFor<T, K> }[keyof T & string];

export type FilterKeys<T> = Array<NestedKeys<T>>;
export type SortParams = Record<string, 1 | -1>;

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
