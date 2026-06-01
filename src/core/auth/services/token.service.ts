import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { authEnv } from '../../env';
import {
  TAccessTokenPayload,
  TRefreshTokenPayload,
} from '../types/token.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authEnv.KEY)
    private readonly authConfig: ConfigType<typeof authEnv>,
  ) {}

  signAccessToken(userId: string, username: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, username, type: 'access' } satisfies TAccessTokenPayload,
      {
        secret: this.authConfig.accessSecret,
        expiresIn: this.authConfig.accessTtlSeconds,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<TAccessTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TAccessTokenPayload>(
        token,
        {
          secret: this.authConfig.accessSecret,
        },
      );

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  signRefreshToken(userId: string, sessionId: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        sid: sessionId,
        jti: randomUUID(),
        type: 'refresh',
      } satisfies TRefreshTokenPayload,
      {
        secret: this.authConfig.refreshSecret,
        expiresIn: this.authConfig.refreshTtlSeconds,
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<TRefreshTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TRefreshTokenPayload>(
        token,
        {
          secret: this.authConfig.refreshSecret,
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getRefreshExpiresAt(): Date {
    return new Date(Date.now() + this.authConfig.refreshTtlSeconds * 1000);
  }
}
