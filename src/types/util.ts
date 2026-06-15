type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? K | `${K}.${NestedKeys<T[K]>}`
    : K;
}[keyof T & string];

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
