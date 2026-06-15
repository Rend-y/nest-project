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
    expect(users.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });
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
    expect(users.pagination.total).toBe(0);
    expect(users.pagination.totalPages).toBe(0);
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
    expect(users.pagination.total).toBe(1);
  });

  it('returns paginated users list', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const secondUser = await registerUser();
    const thirdUser = await registerUser();

    const firstPageResponse = await api()
      .get('/users/list')
      .query({ page: 1, limit: 2 })
      .set('Authorization', bearer(firstUser.auth.accessToken))
      .expect(200);
    const firstPage = expectListUsersResponse(firstPageResponse.body);

    expect(firstPage.users).toHaveLength(2);
    expect(firstPage.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });

    const secondPageResponse = await api()
      .get('/users/list')
      .query({ page: 2, limit: 2 })
      .set('Authorization', bearer(firstUser.auth.accessToken))
      .expect(200);
    const secondPage = expectListUsersResponse(secondPageResponse.body);

    const returnedUserIds = [
      ...firstPage.users.map((user) => user.id),
      ...secondPage.users.map((user) => user.id),
    ];

    expect(secondPage.users).toHaveLength(1);
    expect(returnedUserIds).toEqual(
      expect.arrayContaining([
        firstUser.user.id,
        secondUser.user.id,
        thirdUser.user.id,
      ]),
    );
  });

  it('filters users by username', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser({ username: 'alpha-user' });
    const secondUser = await registerUser({ username: 'beta-user' });
    await registerUser({ username: 'gamma-account' });

    const response = await api()
      .get('/users/list')
      .query({ username: 'USER' })
      .set('Authorization', bearer(firstUser.auth.accessToken))
      .expect(200);
    const users = expectListUsersResponse(response.body);
    const userIds = users.users.map((user) => user.id);

    expect(userIds).toContain(firstUser.user.id);
    expect(userIds).toContain(secondUser.user.id);
    expect(users.users).toHaveLength(2);
    expect(users.pagination.total).toBe(2);
  });

  it('rejects invalid pagination query', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .get('/users/list')
      .query({ page: 0, limit: 101 })
      .set('Authorization', bearer(auth.accessToken))
      .expect(400);
  });

  it('uses defaults for empty optional query values', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    const response = await api()
      .get('/users/list')
      .query({ page: '', limit: '', username: '' })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);
    const users = expectListUsersResponse(response.body);

    expect(users.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });
});
