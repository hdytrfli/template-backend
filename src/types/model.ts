import type { Types } from 'mongoose';

export type AuthToken = {
  accessToken: string;
};

export type LoginData = AuthToken & {
  user: UserDTO;
};

export type MailRecipient = {
  email: string;
  name: string;
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

export type CompanyDTO = ModelBase & {
  name: string;
  type: string;
  email: string;
  country: {
    code: string;
    label: string;
  };
  createdBy?: Types.ObjectId;
};
