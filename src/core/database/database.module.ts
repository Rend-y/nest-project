import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { databaseEnv } from '../env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseEnv.KEY],
      useFactory: (databaseConfig: ConfigType<typeof databaseEnv>) => ({
        type: 'postgres',
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.name,
        entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, './migrations/*{.ts,.js}')],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
