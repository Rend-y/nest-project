import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appEnv, databaseEnv, redisEnv } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
      load: [appEnv, databaseEnv, redisEnv],
    }),
  ],
})
export class EnvModule {}
