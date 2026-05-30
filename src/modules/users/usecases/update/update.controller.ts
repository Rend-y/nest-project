import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/auth';
import { UpdateUserParamsDto, UpdateUserRequestDto } from './dto/request.dto';
import { UpdateUserResponseDto } from './dto/response.dto';
import { UpdateUserUseCase } from './update.usecase';

@ApiTags('users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UpdateUserResponseDto })
  @UseGuards(AuthGuard)
  update(
    @Param() params: UpdateUserParamsDto,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute(params.id, dto);
  }
}
