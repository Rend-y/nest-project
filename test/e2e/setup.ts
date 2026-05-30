import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { UsersRepository } from '../../src/modules/users/repository/users.repository';
import {
  buildDatabaseUrl,
  createTemporaryDatabase,
  dropTemporaryDatabase,
  getOptionalEnv,
  getRequiredDatabaseName,
} from './utils/database';
import { expectAuthResponse, expectUserResponse } from './utils/response';
import type { AuthResponse, UserResponse } from './utils/response';
import { uniqueSuffix } from './utils/value';

export {
  bearer,
  expectInvalidUserId,
  expectUnauthorizedWithInvalidAccessToken,
  expectUnauthorizedWithoutAccessToken,
  missingUserId,
} from './utils/request';
export {
  expectAuthResponse,
  expectListUsersResponse,
  expectLogoutResponse,
  expectUserResponse,
} from './utils/response';
export { uniqueSuffix } from './utils/value';

type RegisterUserOptions = {
  username?: string | null;
  email?: string | null;
  age?: number | null;
  password?: string | null;
};

type RegisteredUser = {
  auth: AuthResponse;
  user: UserResponse;
  password: string;
};

export type E2eTestContext = {
  app: INestApplication;
  dataSource: DataSource;
  usersRepository: UsersRepository;
  databaseName: string;
  api: () => request.Agent;
  registerUser: (options?: RegisterUserOptions) => Promise<RegisteredUser>;
};

export const setupE2eTest = (): (() => E2eTestContext) => {
  let context: E2eTestContext | null = null;
  let originalDatabaseName: string | null = null;
  let originalDatabaseUrl: string | null = null;
  let temporaryDatabaseName: string | null = null;

  beforeAll(async () => {
    originalDatabaseName = getRequiredDatabaseName();
    originalDatabaseUrl = getOptionalEnv('DATABASE_URL');
    temporaryDatabaseName = await createTemporaryDatabase();
    process.env.DATABASE_NAME = temporaryDatabaseName;
    process.env.DATABASE_URL = buildDatabaseUrl(temporaryDatabaseName);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    const dataSource = app.get(DataSource);
    const usersRepository = app.get(UsersRepository);
    await dataSource.runMigrations();

    const api = (): request.Agent => {
      return request(app.getHttpServer());
    };

    const registerUser = async (
      options: RegisterUserOptions = {},
    ): Promise<RegisteredUser> => {
      const suffix = uniqueSuffix();
      const password = options.password ?? 'password123';
      const authResponse = await api()
        .post('/auth/register')
        .send({
          username: options.username ?? `user-${suffix}`,
          email: options.email ?? `user-${suffix}@example.com`,
          age: options.age ?? 21,
          password,
        })
        .expect(201);
      const auth = expectAuthResponse(authResponse.body);

      const userResponse = await api()
        .get('/users/me')
        .set('Authorization', `Bearer ${auth.accessToken}`)
        .expect(200);
      const user = expectUserResponse(userResponse.body);

      return { auth, user, password };
    };

    context = {
      app,
      dataSource,
      usersRepository,
      databaseName: temporaryDatabaseName,
      api,
      registerUser,
    };
  });

  beforeEach(async () => {
    const currentContext = context;

    if (currentContext === null) {
      throw new Error('E2E context is not initialized');
    }

    await currentContext.dataSource.query(
      'TRUNCATE TABLE "auth_sessions", "local_auth", "users" RESTART IDENTITY CASCADE',
    );
  });

  afterAll(async () => {
    const databaseName = temporaryDatabaseName;

    await context?.app.close();

    if (originalDatabaseName !== null) {
      process.env.DATABASE_NAME = originalDatabaseName;
    }

    if (originalDatabaseUrl !== null) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }

    if (databaseName !== null) {
      await dropTemporaryDatabase(databaseName);
    }
  });

  return () => {
    if (context === null) {
      throw new Error('E2E context is not initialized');
    }

    return context;
  };
};
