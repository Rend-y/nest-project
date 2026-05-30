import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LocalAuthEntity } from '../../local/entities/local-auth.entity';
import { PasswordHasherService } from '../../services/password-hasher.service';
import { TokenPairService } from '../../services/token-pair.service';
import { UserEntity } from '../../../users/entities/user.entity';
import { RegisterRequestDto } from './dto/request.dto';
import { RegisterResponseDto } from './dto/response.dto';

type AuthMeta = {
  userAgent?: string | null;
  ip?: string | null;
};

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenPairService: TokenPairService,
  ) {}

  async execute(
    dto: RegisterRequestDto,
    meta: AuthMeta,
  ): Promise<RegisterResponseDto> {
    const user = await this.dataSource.transaction(async (manager) => {
      const usersRepository = manager.getRepository(UserEntity);
      const localAuthRepository = manager.getRepository(LocalAuthEntity);

      const existingUser = await usersRepository
        .createQueryBuilder('user')
        .where('user.username = :username', { username: dto.username })
        .orWhere('user.email = :email', { email: dto.email })
        .getOne();

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const newUser = await usersRepository.save(
        usersRepository.create({
          username: dto.username,
          email: dto.email,
          age: dto.age,
        }),
      );

      await localAuthRepository.save(
        localAuthRepository.create({
          userId: newUser.id,
          passwordHash: await this.passwordHasher.hash(dto.password),
        }),
      );

      return newUser;
    });

    return this.tokenPairService.create(user, meta);
  }
}
