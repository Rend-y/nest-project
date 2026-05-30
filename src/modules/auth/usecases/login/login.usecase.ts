import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalAuthRepository } from '../../repository/local-auth.repository';
import { PasswordHasherService } from '../../services/password-hasher.service';
import { TokenPairService } from '../../services/token-pair.service';
import { UsersRepository } from '../../../users/repository/users.repository';
import { LoginRequestDto } from './dto/request.dto';
import { LoginResponseDto } from './dto/response.dto';

type AuthMeta = {
  userAgent?: string | null;
  ip?: string | null;
};

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly localAuthRepository: LocalAuthRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenPairService: TokenPairService,
  ) {}

  async execute(dto: LoginRequestDto, meta: AuthMeta): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const localAuth = await this.localAuthRepository.findOne({
      where: { userId: user.id },
    });

    if (!localAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.passwordHasher.compare(
      dto.password,
      localAuth.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.tokenPairService.create(user, meta);
  }
}
