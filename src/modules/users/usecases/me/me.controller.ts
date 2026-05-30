import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../../../auth/types/authenticated-request';
import { AuthGuard } from '../../../auth/guards/auth.guard';
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
  me(@Req() request: AuthenticatedRequest): Promise<MeResponseDto> {
    return this.meUseCase.execute(request.user.sub);
  }
}
