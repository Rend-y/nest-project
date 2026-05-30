import {
  IsEmail,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
