import {
  bearer,
  expectInvalidUserId,
  expectUnauthorizedWithoutAccessToken,
  missingUserId,
  setupE2eTest,
} from '../../../../../test/e2e/setup';

describe('DeleteUserController e2e', () => {
  const getContext = setupE2eTest();

  it('soft-deletes a user', async () => {
    const { api, registerUser, usersRepository } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(204);

    await api()
      .get(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);

    const deletedUser = await usersRepository.findOne({
      where: { id: user.id },
      withDeleted: true,
    });

    if (deletedUser === null) {
      throw new Error('Expected deleted user row');
    }

    expect(deletedUser.deletedAt).toBeInstanceOf(Date);
  });

  it('rejects request without access token', async () => {
    const { api, registerUser } = getContext();
    const { user } = await registerUser();

    await expectUnauthorizedWithoutAccessToken(() =>
      api().delete(`/users/${user.id}`),
    );
  });

  it('rejects invalid user id', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await expectInvalidUserId(
      (userId) => api().delete(`/users/${userId}`),
      auth.accessToken,
    );
  });

  it('returns not found for missing user', async () => {
    const { api, registerUser } = getContext();
    const { auth } = await registerUser();

    await api()
      .delete(`/users/${missingUserId}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);
  });

  it('returns not found when deleting already deleted user', async () => {
    const { api, registerUser } = getContext();
    const { auth, user } = await registerUser();

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(204);

    await api()
      .delete(`/users/${user.id}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(404);
  });
});
