import request from 'supertest';

type TRequestFactory = () => request.Test;
type TUserIdRequestFactory = (userId: string) => request.Test;

export const missingUserId = '00000000-0000-4000-8000-000000000000';

export const bearer = (accessToken: string): string => `Bearer ${accessToken}`;

export const expectUnauthorizedWithoutAccessToken = async (
  createRequest: TRequestFactory,
): Promise<void> => {
  await createRequest().expect(401);
};

export const expectUnauthorizedWithInvalidAccessToken = async (
  createRequest: TRequestFactory,
): Promise<void> => {
  await createRequest()
    .set('Authorization', 'Bearer invalid-token')
    .expect(401);
};

export const expectInvalidUserId = async (
  createRequest: TUserIdRequestFactory,
  accessToken: string,
): Promise<void> => {
  await createRequest('not-a-uuid')
    .set('Authorization', bearer(accessToken))
    .expect(400);
};
