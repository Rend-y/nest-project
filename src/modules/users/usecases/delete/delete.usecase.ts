import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.softDelete({ id });
  }
}
