import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { GetUserByIdResponseDto } from './dto/response.dto';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string): Promise<GetUserByIdResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return GetUserByIdResponseDto.fromEntity(user);
  }
}
