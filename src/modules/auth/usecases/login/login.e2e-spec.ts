import {
  bearer,
  expectAuthResponse,
  expectUserResponse,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('LoginController e2e', () => {
  const getContext = setupE2eTest();

  it('logs in and returns token pair', async () => {
    const { api, registerUser } = getContext();
    const { password, user } = await registerUser();

    const response = await api()
      .post('/auth/login')
      .send({
        username: user.username,
        password,
      })
      .expect(201);

    const auth = expectAuthResponse(response.body);

    const meResponse = await api()
      .get('/users/me')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);
    const me = expectUserResponse(meResponse.body);

    expect(me.id).toBe(user.id);
  });

  it('rejects wrong password', async () => {
    const { api, registerUser } = getContext();
    const { user } = await registerUser();

    await api()
      .post('/auth/login')
      .send({
        username: user.username,
        password: 'wrong-password',
      })
      .expect(401);
  });

  it('rejects unknown username', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/login')
      .send({
        username: 'missing-user',
        password: 'password123',
      })
      .expect(401);
  });

  it('rejects invalid body', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/login')
      .send({
        username: 'ab',
        password: 'short',
      })
      .expect(400);
  });

  it('rejects unknown fields', async () => {
    const { api, registerUser } = getContext();
    const { password, user } = await registerUser();

    await api()
      .post('/auth/login')
      .send({
        username: user.username,
        password,
        rememberMe: true,
      })
      .expect(400);
  });
});
