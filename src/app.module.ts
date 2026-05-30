import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database';
import { EnvModule } from './core/env';
import { HealthModule } from './core/health';

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
