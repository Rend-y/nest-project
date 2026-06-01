import { UserResponseDto } from '../../user.response.dto';

export class ListUsersPaginationResponseDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ListUsersResponseDto {
  users: UserResponseDto[];
  pagination: ListUsersPaginationResponseDto;
}
