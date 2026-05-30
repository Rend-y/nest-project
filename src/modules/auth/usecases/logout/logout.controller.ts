import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LogoutRequestDto } from './dto/request.dto';
import { LogoutResponseDto } from './dto/response.dto';
import { LogoutUseCase } from './logout.usecase';

@ApiTags('auth')
@Controller('auth')
export class LogoutController {
  constructor(private readonly logoutUseCase: LogoutUseCase) {}

  @Post('logout')
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@Body() dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    return this.logoutUseCase.execute(dto);
  }
}
