import {
  expectLogoutResponse,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('LogoutController e2e', () => {
  const getContext = setupE2eTest();

  it('revokes refresh token', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    const response = await api()
      .post('/auth/logout')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(201);
    const logout = expectLogoutResponse(response.body);

    expect(logout.success).toBe(true);

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(401);
  });

  it('is idempotent for already revoked refresh token', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .post('/auth/logout')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(201);

    const response = await api()
      .post('/auth/logout')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(201);
    const logout = expectLogoutResponse(response.body);

    expect(logout.success).toBe(true);
  });

  it('rejects invalid refresh token', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/logout')
      .send({
        refreshToken: 'invalid-token',
      })
      .expect(401);
  });

  it('rejects invalid body', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/logout')
      .send({
        refreshToken: 123,
      })
      .expect(400);
  });

  it('rejects unknown fields', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .post('/auth/logout')
      .send({
        refreshToken: auth.refreshToken,
        allDevices: true,
      })
      .expect(400);
  });
});
