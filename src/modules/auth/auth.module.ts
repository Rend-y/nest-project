import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/auth.guard';
import { LocalAuthRepository } from './repository/local-auth.repository';
import { PasswordHasherService } from './services/password-hasher.service';
import { TokenPairService } from './services/token-pair.service';
import { TokenService } from './services/token.service';
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
  imports: [forwardRef(() => UsersModule), JwtModule.register({})],
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
    TokenService,
    TokenPairService,
    AuthGuard,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
  ],
  exports: [LocalAuthRepository, AuthGuard, TokenService],
})
export class AuthModule {}
