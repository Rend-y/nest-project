import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateUserParamsDto {
  @IsUUID()
  id: string;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string | null = null;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email: string | null = null;

  @IsOptional()
  @IsInt()
  @Min(0)
  age: number | null = null;
}
