import {
  bearer,
  expectAuthResponse,
  expectUserResponse,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('RefreshTokenController e2e', () => {
  const getContext = setupE2eTest();

  it('rotates refresh token and returns a new token pair', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    const response = await api()
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(201);

    const rotatedAuth = expectAuthResponse(response.body);

    expect(rotatedAuth.refreshToken).not.toBe(auth.refreshToken);

    const meResponse = await api()
      .get('/users/me')
      .set('Authorization', bearer(rotatedAuth.accessToken))
      .expect(200);
    const me = expectUserResponse(meResponse.body);

    expect(me.id).toBe(user.id);
  });

  it('rejects reused refresh token', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(201);

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken,
      })
      .expect(401);
  });

  it('rejects invalid refresh token', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: 'invalid-token',
      })
      .expect(401);
  });

  it('rejects invalid body', async () => {
    const { api } = getContext();

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: 123,
      })
      .expect(400);
  });

  it('rejects unknown fields', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken,
        accessToken: auth.accessToken,
      })
      .expect(400);
  });
});
