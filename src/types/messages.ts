export type UserWelcomeMessage = {
  userId: string;
  email: string;
  name: string;
};

export const MESSAGE_REGISTER = {
  notifications: {
    'user.welcome': {} as UserWelcomeMessage,
  },
};

export type Messages = typeof MESSAGE_REGISTER;
export type Exchange = keyof typeof MESSAGE_REGISTER;
