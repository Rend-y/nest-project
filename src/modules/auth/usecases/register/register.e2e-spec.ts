import {
  bearer,
  expectAuthResponse,
  expectUserResponse,
  setupE2eTest,
  uniqueSuffix,
} from '../../../../../test/e2e/setup';

describe('RegisterController e2e', () => {
  const getContext = setupE2eTest();

  it('registers a user and returns token pair', async () => {
    const { api } = getContext();
    const suffix = uniqueSuffix();

    const response = await api()
      .post('/auth/register')
      .send({
        username: `user-${suffix}`,
        email: `user-${suffix}@example.com`,
        age: 21,
        password: 'password123',
      })
      .expect(201);

    const auth = expectAuthResponse(response.body);

    const meResponse = await api()
      .get('/users/me')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);
    const me = expectUserResponse(meResponse.body);

    expect(me.username).toBe(`user-${suffix}`);
    expect(me.email).toBe(`user-${suffix}@example.com`);
    expect(me.age).toBe(21);
  });

  it('rejects invalid body', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/register')
      .send({
        username: 'ab',
        email: 'invalid-email',
        age: -1,
        password: 'short',
      })
      .expect(400);
  });

  it('rejects unknown fields', async () => {
    const { api } = getContext();
    const suffix = uniqueSuffix();

    await api()
      .post('/auth/register')
      .send({
        username: `user-${suffix}`,
        email: `user-${suffix}@example.com`,
        age: 21,
        password: 'password123',
        role: 'admin',
      })
      .expect(400);
  });

  it('rejects duplicate username', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const suffix = uniqueSuffix();

    await api()
      .post('/auth/register')
      .send({
        username: firstUser.user.username,
        email: `user-${suffix}@example.com`,
        age: 21,
        password: 'password123',
      })
      .expect(409);
  });

  it('rejects duplicate email', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();
    const suffix = uniqueSuffix();

    await api()
      .post('/auth/register')
      .send({
        username: `user-${suffix}`,
        email: firstUser.user.email,
        age: 21,
        password: 'password123',
      })
      .expect(409);
  });

  it('allows reusing username and email from a soft-deleted user', async () => {
    const { api, registerUser } = getContext();
    const firstUser = await registerUser();

    await api()
      .delete(`/users/${firstUser.user.id}`)
      .set('Authorization', bearer(firstUser.auth.accessToken))
      .expect(204);

    const response = await api()
      .post('/auth/register')
      .send({
        username: firstUser.user.username,
        email: firstUser.user.email,
        age: 21,
        password: 'password123',
      })
      .expect(201);

    const auth = expectAuthResponse(response.body);

    const meResponse = await api()
      .get('/users/me')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);
    const me = expectUserResponse(meResponse.body);

    expect(me.id).not.toBe(firstUser.user.id);
    expect(me.username).toBe(firstUser.user.username);
    expect(me.email).toBe(firstUser.user.email);
  });
});
