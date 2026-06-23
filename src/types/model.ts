import type { Types } from 'mongoose';

import type { RequestMethod } from '@/types/util';

export type AuthToken = {
  accessToken: string;
};

export type LoginData = AuthToken & {
  user: UserDTO;
};

export type Timestamp = {
  createdAt?: Date;
  updatedAt?: Date;
};

export type SoftDeletable = {
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
};

type ModelBase = Timestamp & SoftDeletable;

export type UserDTO = ModelBase & {
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

export type LogDTO = Timestamp & {
  requestId: string;
  requestMethod: RequestMethod;
  requestPath: string;
  ipAddress: string;
  environment: string;
  statusCode: number;
  userAgent?: string;
  duration?: number;
  user?: Types.ObjectId;
};
