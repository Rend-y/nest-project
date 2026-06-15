import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { MeResponseDto } from './dto/response.dto';

@Injectable()
export class MeUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<MeResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return MeResponseDto.fromEntity(user);
  }
}
