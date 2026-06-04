import type { Response } from 'express';

import type { PaginationMeta } from '@/models/types';

type BaseResponse = {
  success: boolean;
  message?: string;
};

export type Result<T> = {
  data?: T;
};

export type ErrorResult = {
  error?: Record<string, any>;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export type ErrorResponse = Response<BaseResponse & ErrorResult>;
export type AppResponse<T> = Response<BaseResponse & Result<T>>;
export type PaginatedResponse<T> = Response<BaseResponse & PaginatedResult<T>>;
