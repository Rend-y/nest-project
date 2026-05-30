import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TokenService } from '../../../core/auth';
import { AuthSessionsRepository } from '../repository/auth-sessions.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { PasswordHasherService } from './password-hasher.service';

type SessionMeta = {
  userAgent?: string | null;
  ip?: string | null;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenPairService {
  constructor(
    private readonly authSessionsRepository: AuthSessionsRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async create(user: UserEntity, meta: SessionMeta): Promise<TokenPair> {
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

    return {
      accessToken: await this.tokenService.signAccessToken(
        user.id,
        user.username,
      ),
      refreshToken,
    };
  }

  async rotate(refreshToken: string): Promise<TokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.authSessionsRepository.findOne({
      where: { id: payload.sid, userId: payload.sub },
      relations: { user: true },
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
      await this.authSessionsRepository.save(session);
      throw new UnauthorizedException('Invalid token');
    }

    const nextRefreshToken = await this.tokenService.signRefreshToken(
      session.userId,
      session.id,
    );

    session.refreshTokenHash = await this.passwordHasher.hash(nextRefreshToken);
    session.expiresAt = this.tokenService.getRefreshExpiresAt();
    await this.authSessionsRepository.save(session);

    return {
      accessToken: await this.tokenService.signAccessToken(
        session.userId,
        session.user.username,
      ),
      refreshToken: nextRefreshToken,
    };
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
