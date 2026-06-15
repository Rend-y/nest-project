import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database';
import { EnvModule } from './core/env';
import { HealthModule } from './core/health';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
