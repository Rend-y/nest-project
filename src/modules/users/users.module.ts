import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from './repository/users.repository';
import { GetUserByIdController } from './usecases/get-by-id/get-by-id.controller';
import { GetUserByIdUseCase } from './usecases/get-by-id/get-by-id.usecase';
import { ListUsersController } from './usecases/list/list.controller';
import { ListUsersUseCase } from './usecases/list/list.usecase';
import { MeController } from './usecases/me/me.controller';
import { MeUseCase } from './usecases/me/me.usecase';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [MeController, ListUsersController, GetUserByIdController],
  providers: [UsersRepository, MeUseCase, ListUsersUseCase, GetUserByIdUseCase],
  exports: [UsersRepository],
})
export class UsersModule {}
