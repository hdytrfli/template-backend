import type { Types } from 'mongoose';

export type UserDTO = {
  username: string;
  name: string;
  level: string;
  email?: string;
  phone?: string;
  lastLogin?: Date;
  createdBy?: Types.ObjectId;
};

export type PrivateUserDTO = UserDTO & {
  password: string;
};

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

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type LoginData = TokenPair & {
  user: UserDTO;
};
