export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserResponse = {
  id: string;
  username: string;
  age: number;
  email: string;
};

export type ListUsersResponse = {
  users: UserResponse[];
};

export type LogoutResponse = {
  success: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const expectAuthResponse = (value: unknown): AuthResponse => {
  if (
    !isRecord(value) ||
    typeof value.accessToken !== 'string' ||
    typeof value.refreshToken !== 'string'
  ) {
    throw new Error('Expected auth response');
  }

  return {
    accessToken: value.accessToken,
    refreshToken: value.refreshToken,
  };
};

export const expectUserResponse = (value: unknown): UserResponse => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.username !== 'string' ||
    typeof value.age !== 'number' ||
    typeof value.email !== 'string'
  ) {
    throw new Error('Expected user response');
  }

  return {
    id: value.id,
    username: value.username,
    age: value.age,
    email: value.email,
  };
};

export const expectListUsersResponse = (value: unknown): ListUsersResponse => {
  if (!isRecord(value) || !Array.isArray(value.users)) {
    throw new Error('Expected list users response');
  }

  return {
    users: value.users.map((user) => expectUserResponse(user)),
  };
};

export const expectLogoutResponse = (value: unknown): LogoutResponse => {
  if (!isRecord(value) || typeof value.success !== 'boolean') {
    throw new Error('Expected logout response');
  }

  return {
    success: value.success,
  };
};
