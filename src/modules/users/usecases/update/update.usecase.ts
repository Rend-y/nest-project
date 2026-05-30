import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { UpdateUserRequestDto } from './dto/request.dto';
import { UpdateUserResponseDto } from './dto/response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    id: string,
    dto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    if (dto.username === null && dto.email === null && dto.age === null) {
      throw new BadRequestException('At least one field is required');
    }

    if (dto.username !== null || dto.email !== null) {
      const existingUser = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id != :id', { id })
        .andWhere('(user.username = :username OR user.email = :email)', {
          username: dto.username ?? user.username,
          email: dto.email ?? user.email,
        })
        .getOne();

      if (existingUser !== null) {
        throw new ConflictException('User already exists');
      }
    }

    if (dto.username !== null) {
      user.username = dto.username;
    }

    if (dto.email !== null) {
      user.email = dto.email;
    }

    if (dto.age !== null) {
      user.age = dto.age;
    }

    const updatedUser = await this.usersRepository.save(user);

    return UpdateUserResponseDto.fromEntity(updatedUser);
  }
}
