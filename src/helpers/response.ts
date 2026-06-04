import type { Response } from 'express';

import type { PaginationMeta } from '@/models/types';

type BaseResponse = {
  success: boolean;
  error?: Record<string, any>;
  message?: string;
};

export type Result<T> = {
  data?: T;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export type AppResponse<T> = Response<BaseResponse & Result<T>>;
export type PaginatedResponse<T> = Response<BaseResponse & PaginatedResult<T>>;
