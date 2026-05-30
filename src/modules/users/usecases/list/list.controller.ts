import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/auth';
import { ListUsersResponseDto } from './dto/response.dto';
import { ListUsersUseCase } from './list.usecase';

@ApiTags('users')
@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  @Get('list')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ListUsersResponseDto })
  @UseGuards(AuthGuard)
  list(): Promise<ListUsersResponseDto> {
    return this.listUsersUseCase.execute();
  }
}
