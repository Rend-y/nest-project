import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export const appEnv = registerAs('appConfiguration', () => ({
  port: env.get('PORT').default(3000).asPortNumber(),
}));

export const databaseEnv = registerAs('databaseConfiguration', () => ({
  host: env.get('DATABASE_HOST').required().asString(),
  port: env.get('DATABASE_PORT').required().asPortNumber(),
  username: env.get('DATABASE_USERNAME').required().asString(),
  password: env.get('DATABASE_PASSWORD').required().asString(),
  name: env.get('DATABASE_NAME').required().asString(),
  url: env.get('DATABASE_URL').required().asString(),
}));

export const redisEnv = registerAs('redisConfiguration', () => ({
  url: env.get('REDIS_URL').required().asString(),
}));
