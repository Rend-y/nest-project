import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenRequestDto } from './dto/request.dto';
import { RefreshTokenResponseDto } from './dto/response.dto';
import { RefreshTokenUseCase } from './refresh-token.usecase';

@ApiTags('auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh')
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  refresh(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }
}
