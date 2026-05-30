import {
  bearer,
  expectUnauthorizedWithInvalidAccessToken,
  expectUnauthorizedWithoutAccessToken,
  expectUserResponse,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('MeController e2e', () => {
  const getContext = setupE2eTest();

  it('returns current user profile', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    const response = await api()
      .get('/users/me')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    const me = expectUserResponse(response.body);

    expect(me.id).toBe(user.id);
    expect(me.username).toBe(user.username);
    expect(me.email).toBe(user.email);
    expect(me.age).toBe(user.age);
  });

  it('rejects request without access token', async () => {
    const { api } = getContext();

    await expectUnauthorizedWithoutAccessToken(() => api().get('/users/me'));
  });

  it('rejects request with invalid access token', async () => {
    const { api } = getContext();

    await expectUnauthorizedWithInvalidAccessToken(() =>
      api().get('/users/me'),
    );
  });

  it('returns not found when current user was soft-deleted', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(204);

    await api()
      .get('/users/me')
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);
  });
});
