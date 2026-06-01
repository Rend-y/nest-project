import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { TokenService } from '../../../core/auth';
import { AuthSessionEntity } from '../entities/auth-session.entity';
import { AuthSessionsRepository } from '../repository/auth-sessions.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { PasswordHasherService } from './password-hasher.service';
import { TSessionMeta, TTokenPair } from '../types/token-pair.service';

@Injectable()
export class TokenPairService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authSessionsRepository: AuthSessionsRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async create(user: UserEntity, meta: TSessionMeta): Promise<TTokenPair> {
    const sessionId = randomUUID();
    const refreshToken = await this.tokenService.signRefreshToken(
      user.id,
      sessionId,
    );
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);

    await this.authSessionsRepository.save(
      this.authSessionsRepository.create({
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        userAgent: meta.userAgent ?? null,
        ip: meta.ip ?? null,
        expiresAt: this.tokenService.getRefreshExpiresAt(),
        revokedAt: null,
      }),
    );

    const accessToken = await this.tokenService.signAccessToken(
      user.id,
      sessionId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async rotate(refreshToken: string): Promise<TTokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    const nextSession = await this.dataSource.transaction(async (manager) => {
      const authSessionsRepository = manager.getRepository(AuthSessionEntity);
      const session = await authSessionsRepository.findOne({
        where: { id: payload.sid, userId: payload.sub },
        lock: { mode: 'pessimistic_write' },
      });

      if (!session || session.revokedAt || session.expiresAt <= new Date()) {
        throw new UnauthorizedException('Invalid token');
      }

      const isValidRefreshToken = await this.passwordHasher.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      if (!isValidRefreshToken) {
        session.revokedAt = new Date();
        await authSessionsRepository.save(session);
        throw new UnauthorizedException('Invalid token');
      }

      session.revokedAt = new Date();
      await authSessionsRepository.save(session);

      const user = await manager.getRepository(UserEntity).findOne({
        where: { id: session.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        user,
        userAgent: session.userAgent,
        ip: session.ip,
      };
    });

    return this.create(nextSession.user, {
      userAgent: nextSession.userAgent,
      ip: nextSession.ip,
    });
  }

  async revoke(refreshToken: string): Promise<void> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.authSessionsRepository.findOne({
      where: { id: payload.sid, userId: payload.sub },
    });

    if (!session || session.revokedAt) {
      return;
    }

    const isValidRefreshToken = await this.passwordHasher.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValidRefreshToken) {
      return;
    }

    session.revokedAt = new Date();
    await this.authSessionsRepository.save(session);
  }
}
