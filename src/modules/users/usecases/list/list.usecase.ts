import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { ListUsersRequestDto } from './dto/request.dto';
import { ListUsersResponseDto } from './dto/response.dto';
import { UserResponseDto } from '../user.response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(dto: ListUsersRequestDto): Promise<ListUsersResponseDto> {
    const page = dto.page;
    const limit = dto.limit;
    const query = this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (dto.username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${dto.username}%`,
      });
    }

    const [users, total] = await query.getManyAndCount();

    return {
      users: users.map((user) => UserResponseDto.fromEntity(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
