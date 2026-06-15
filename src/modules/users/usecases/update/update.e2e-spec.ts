import {
  bearer,
  expectInvalidUserId,
  expectUnauthorizedWithoutAccessToken,
  expectUserResponse,
  missingUserId,
  setupE2eTest,
  uniqueSuffix,
} from '../../../../../test/e2e/setup';

describe('UpdateUserController e2e', () => {
  const getContext = setupE2eTest();

  it('updates a user', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();
    const suffix = uniqueSuffix();

    const response = await api()
      .patch(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        username: `updated-${suffix}`,
        email: `updated-${suffix}@example.com`,
        age: 30,
      })
      .expect(200);

    const updatedUser = expectUserResponse(response.body);

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.username).toBe(`updated-${suffix}`);
    expect(updatedUser.email).toBe(`updated-${suffix}@example.com`);
    expect(updatedUser.age).toBe(30);
  });

  it('updates a single field', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();
    const suffix = uniqueSuffix();

    const response = await api()
      .patch(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        username: `updated-${suffix}`,
      })
      .expect(200);

    const updatedUser = expectUserResponse(response.body);

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.username).toBe(`updated-${suffix}`);
    expect(updatedUser.email).toBe(user.email);
    expect(updatedUser.age).toBe(user.age);
  });

  it('rejects request without access token', async () => {
    const { api, registerUser } = getContext();
    const { user } = await registerUser();

    await expectUnauthorizedWithoutAccessToken(() =>
      api().patch(`/users/${user.id}`).send({
        age: 30,
      }),
    );
  });

  it('rejects invalid user id', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await expectInvalidUserId(
      (userId) =>
        api().patch(`/users/${userId}`).send({
          age: 30,
        }),
      auth.accessToken,
    );
  });

  it('returns not found for missing user', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .patch(`/users/${missingUserId}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        age: 30,
      })
      .expect(404);
  });

  it('rejects empty update body', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .patch(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({})
      .expect(400);
  });

  it('rejects invalid update body', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .patch(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        username: 'ab',
        email: 'invalid-email',
        age: -1,
      })
      .expect(400);
  });

  it('rejects unknown update fields', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .patch(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        role: 'admin',
      })
      .expect(400);
  });

  it('rejects duplicate username', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const secondUser = await registerUser();

    await api()
      .patch(`/users/${secondUser.user.id}`)
      .set('Authorization', bearer(secondUser.auth.accessToken))
      .send({
        username: firstUser.user.username,
      })
      .expect(409);
  });

  it('rejects duplicate email', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const secondUser = await registerUser();

    await api()
      .patch(`/users/${secondUser.user.id}`)
      .set('Authorization', bearer(secondUser.auth.accessToken))
      .send({
        email: firstUser.user.email,
      })
      .expect(409);
  });
});
