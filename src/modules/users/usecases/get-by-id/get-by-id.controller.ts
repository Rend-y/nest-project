import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/auth';
import { GetUserByIdRequestDto } from './dto/request.dto';
import { GetUserByIdResponseDto } from './dto/response.dto';
import { GetUserByIdUseCase } from './get-by-id.usecase';

@ApiTags('users')
@Controller('users')
export class GetUserByIdController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetUserByIdResponseDto })
  @UseGuards(AuthGuard)
  getById(
    @Param() params: GetUserByIdRequestDto,
  ): Promise<GetUserByIdResponseDto> {
    return this.getUserByIdUseCase.execute(params.id);
  }
}
