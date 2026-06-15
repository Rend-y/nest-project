import 'dotenv/config';
import * as env from 'env-var';
import { join } from 'path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: env.get('DATABASE_HOST').required().asString(),
  port: env.get('DATABASE_PORT').required().asPortNumber(),
  username: env.get('DATABASE_USERNAME').required().asString(),
  password: env.get('DATABASE_PASSWORD').required().asString(),
  database: env.get('DATABASE_NAME').required().asString(),
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
});
