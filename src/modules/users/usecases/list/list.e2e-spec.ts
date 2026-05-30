import {
  bearer,
  expectListUsersResponse,
  expectUnauthorizedWithoutAccessToken,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('ListUsersController e2e', () => {
  const getContext = setupE2eTest();

  it('returns users list', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const secondUser = await registerUser();

    const response = await api()
      .get('/users/list')
      .set('Authorization', bearer(firstUser.auth.accessToken))
      .expect(200);

    const users = expectListUsersResponse(response.body);
    const userIds = users.users.map((user) => user.id);

    expect(userIds).toContain(firstUser.user.id);
    expect(userIds).toContain(secondUser.user.id);
  });

  it('rejects request without access token', async () => {
    const { api } = getContext();

    await expectUnauthorizedWithoutAccessToken(() => api().get('/users/list'));
  });

  it('returns empty list when users do not exist', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(204);

    const response = await api()
      .get('/users/list')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    const users = expectListUsersResponse(response.body);

    expect(users.users).toHaveLength(0);
  });

  it('does not return soft-deleted users', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const secondUser = await registerUser();

    await api()
      .delete(`/users/${firstUser.user.id}`)
      .set('Authorization', bearer(secondUser.auth.accessToken))
      .expect(204);

    const response = await api()
      .get('/users/list')
      .set('Authorization', bearer(secondUser.auth.accessToken))
      .expect(200);

    const users = expectListUsersResponse(response.body);
    const userIds = users.users.map((user) => user.id);

    expect(userIds).not.toContain(firstUser.user.id);
    expect(userIds).toContain(secondUser.user.id);
  });
});
