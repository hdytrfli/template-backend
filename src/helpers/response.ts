import type { Response } from 'express';

export type AppResponse<T> = Response<{
  success: boolean;
  data?: T;
  error?: Record<string, any>;
  message?: string;
}>;

export type PaginatedResponse<T> = AppResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
