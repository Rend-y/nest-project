import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserId } from '../../../../core/auth';
import { MeResponseDto } from './dto/response.dto';
import { MeUseCase } from './me.usecase';

@ApiTags('users')
@Controller('users')
export class MeController {
  constructor(private readonly meUseCase: MeUseCase) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MeResponseDto })
  @UseGuards(AuthGuard)
  me(@UserId() userId: string): Promise<MeResponseDto> {
    return this.meUseCase.execute(userId);
  }
}
