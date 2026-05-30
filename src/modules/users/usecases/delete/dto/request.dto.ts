import { IsUUID } from 'class-validator';

export class DeleteUserRequestDto {
  @IsUUID()
  id: string;
}
