import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  username: string;
  age: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      age: user.age,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
