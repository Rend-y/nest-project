import request from 'supertest';

type RequestFactory = () => request.Test;
type UserIdRequestFactory = (userId: string) => request.Test;

export const missingUserId = '00000000-0000-4000-8000-000000000000';

export const bearer = (accessToken: string): string => `Bearer ${accessToken}`;

export const expectUnauthorizedWithoutAccessToken = async (
  createRequest: RequestFactory,
): Promise<void> => {
  await createRequest().expect(401);
};

export const expectUnauthorizedWithInvalidAccessToken = async (
  createRequest: RequestFactory,
): Promise<void> => {
  await createRequest()
    .set('Authorization', 'Bearer invalid-token')
    .expect(401);
};

export const expectInvalidUserId = async (
  createRequest: UserIdRequestFactory,
  accessToken: string,
): Promise<void> => {
  await createRequest('not-a-uuid')
    .set('Authorization', bearer(accessToken))
    .expect(400);
};
