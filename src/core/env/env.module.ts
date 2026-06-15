import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appEnv, authEnv, databaseEnv, redisEnv } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appEnv, databaseEnv, redisEnv, authEnv],
    }),
  ],
})
export class EnvModule {}
