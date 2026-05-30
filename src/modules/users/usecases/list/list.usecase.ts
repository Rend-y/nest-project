import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { ListUsersResponseDto } from './dto/response.dto';
import { UserResponseDto } from '../user.response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(): Promise<ListUsersResponseDto> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      users: users.map((user) => UserResponseDto.fromEntity(user)),
    };
  }
}
