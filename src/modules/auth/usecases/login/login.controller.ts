import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { LoginRequestDto } from './dto/request.dto';
import { LoginResponseDto } from './dto/response.dto';
import { LoginUseCase } from './login.usecase';

@ApiTags('auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  login(
    @Body() dto: LoginRequestDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto, {
      userAgent: request.get('user-agent') ?? null,
      ip: request.ip ?? null,
    });
  }
}
