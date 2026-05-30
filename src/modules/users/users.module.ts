import { Module } from '@nestjs/common';
import { CoreAuthModule } from '../../core/auth';
import { UsersRepository } from './repository/users.repository';
import { DeleteUserController } from './usecases/delete/delete.controller';
import { DeleteUserUseCase } from './usecases/delete/delete.usecase';
import { GetUserByIdController } from './usecases/get-by-id/get-by-id.controller';
import { GetUserByIdUseCase } from './usecases/get-by-id/get-by-id.usecase';
import { ListUsersController } from './usecases/list/list.controller';
import { ListUsersUseCase } from './usecases/list/list.usecase';
import { MeController } from './usecases/me/me.controller';
import { MeUseCase } from './usecases/me/me.usecase';
import { UpdateUserController } from './usecases/update/update.controller';
import { UpdateUserUseCase } from './usecases/update/update.usecase';

@Module({
  imports: [CoreAuthModule],
  controllers: [
    MeController,
    ListUsersController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    UsersRepository,
    MeUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
