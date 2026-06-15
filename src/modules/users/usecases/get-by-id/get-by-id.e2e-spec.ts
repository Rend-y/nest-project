import {
  bearer,
  expectInvalidUserId,
  expectUnauthorizedWithoutAccessToken,
  expectUserResponse,
  missingUserId,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('GetUserByIdController e2e', () => {
  const getContext = setupE2eTest();

  it('returns user by id', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    const response = await api()
      .get(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    const foundUser = expectUserResponse(response.body);

    expect(foundUser.id).toBe(user.id);
    expect(foundUser.username).toBe(user.username);
    expect(foundUser.email).toBe(user.email);
    expect(foundUser.age).toBe(user.age);
  });

  it('rejects request without access token', async () => {
    const { api, registerUser } = getContext();
    const { user } = await registerUser();

    await expectUnauthorizedWithoutAccessToken(() =>
      api().get(`/users/${user.id}`),
    );
  });

  it('rejects invalid user id', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await expectInvalidUserId(
      (userId) => api().get(`/users/${userId}`),
      auth.accessToken,
    );
  });

  it('returns not found for missing user', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .get(`/users/${missingUserId}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);
  });

  it('returns not found for soft-deleted user', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(204);

    await api()
      .get(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);
  });
});
