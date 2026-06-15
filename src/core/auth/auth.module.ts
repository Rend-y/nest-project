import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, AuthGuard],
  exports: [TokenService, AuthGuard],
})
export class CoreAuthModule {}
