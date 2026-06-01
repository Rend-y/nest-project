export type TAuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  id: string;
  username: string;
  age: number;
  email: string;
};

export type TListUsersResponse = {
  users: TUserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TLogoutResponse = {
  success: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const expectAuthResponse = (value: unknown): TAuthResponse => {
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

export const expectUserResponse = (value: unknown): TUserResponse => {
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

export const expectListUsersResponse = (value: unknown): TListUsersResponse => {
  if (
    !isRecord(value) ||
    !Array.isArray(value.users) ||
    !isRecord(value.pagination) ||
    typeof value.pagination.page !== 'number' ||
    typeof value.pagination.limit !== 'number' ||
    typeof value.pagination.total !== 'number' ||
    typeof value.pagination.totalPages !== 'number'
  ) {
    throw new Error('Expected list users response');
  }

  return {
    users: value.users.map((user) => expectUserResponse(user)),
    pagination: {
      page: value.pagination.page,
      limit: value.pagination.limit,
      total: value.pagination.total,
      totalPages: value.pagination.totalPages,
    },
  };
};

export const expectLogoutResponse = (value: unknown): TLogoutResponse => {
  if (!isRecord(value) || typeof value.success !== 'boolean') {
    throw new Error('Expected logout response');
  }

  return {
    success: value.success,
  };
};
