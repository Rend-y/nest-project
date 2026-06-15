import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/auth';
import { ListUsersRequestDto } from './dto/request.dto';
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
  list(@Query() query: ListUsersRequestDto): Promise<ListUsersResponseDto> {
    return this.listUsersUseCase.execute(query);
  }
}
