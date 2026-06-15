import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { RegisterRequestDto } from './dto/request.dto';
import { RegisterResponseDto } from './dto/response.dto';
import { RegisterUseCase } from './register.usecase';

@ApiTags('auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('register')
  @ApiCreatedResponse({ type: RegisterResponseDto })
  register(
    @Body() dto: RegisterRequestDto,
    @Req() request: Request,
  ): Promise<RegisterResponseDto> {
    return this.registerUseCase.execute(dto, {
      userAgent: request.get('user-agent') ?? null,
      ip: request.ip ?? null,
    });
  }
}
