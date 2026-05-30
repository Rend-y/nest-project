import { Injectable } from '@nestjs/common';
import { TokenPairService } from '../../services/token-pair.service';
import { LogoutRequestDto } from './dto/request.dto';
import { LogoutResponseDto } from './dto/response.dto';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly tokenPairService: TokenPairService) {}

  async execute(dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    await this.tokenPairService.revoke(dto.refreshToken);

    return { success: true };
  }
}
