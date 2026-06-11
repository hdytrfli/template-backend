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

export type SoftDeletable = {
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
};

export type UserDTO = SoftDeletable & {
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

export type CompanyDTO = SoftDeletable & {
  name: string;
  country: string;
  email: string;
  companyType: string;
  createdBy?: Types.ObjectId;
};
