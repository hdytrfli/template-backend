export type FilterKeys<T> = Array<Extract<keyof T, string>>;

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
