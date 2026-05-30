import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/auth';
import { DeleteUserRequestDto } from './dto/request.dto';
import { DeleteUserUseCase } from './delete.usecase';

@ApiTags('users')
@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @UseGuards(AuthGuard)
  delete(@Param() params: DeleteUserRequestDto): Promise<void> {
    return this.deleteUserUseCase.execute(params.id);
  }
}
