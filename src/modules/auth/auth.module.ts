import { Module } from '@nestjs/common';
import { CoreAuthModule } from '../../core/auth';
import { UsersModule } from '../users/users.module';
import { LocalAuthRepository } from './repository/local-auth.repository';
import { PasswordHasherService } from './services/password-hasher.service';
import { TokenPairService } from './services/token-pair.service';
import { AuthSessionsRepository } from './repository/auth-sessions.repository';
import { LoginController } from './usecases/login/login.controller';
import { LoginUseCase } from './usecases/login/login.usecase';
import { LogoutController } from './usecases/logout/logout.controller';
import { LogoutUseCase } from './usecases/logout/logout.usecase';
import { RefreshTokenController } from './usecases/refresh-token/refresh-token.controller';
import { RefreshTokenUseCase } from './usecases/refresh-token/refresh-token.usecase';
import { RegisterController } from './usecases/register/register.controller';
import { RegisterUseCase } from './usecases/register/register.usecase';

@Module({
  imports: [UsersModule, CoreAuthModule],
  controllers: [
    RegisterController,
    LoginController,
    RefreshTokenController,
    LogoutController,
  ],
  providers: [
    LocalAuthRepository,
    AuthSessionsRepository,
    PasswordHasherService,
    TokenPairService,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
  ],
  exports: [LocalAuthRepository],
})
export class AuthModule {}
