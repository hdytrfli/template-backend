import type { Response } from 'express';

export type AppResponse<T> = Response<{
  success: boolean;
  data?: T;
  error?: Record<string, any>;
  message?: string;
}>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};
