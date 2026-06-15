import { Injectable } from '@nestjs/common';
import { TokenPairService } from '../../services/token-pair.service';
import { RefreshTokenRequestDto } from './dto/request.dto';
import { RefreshTokenResponseDto } from './dto/response.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly tokenPairService: TokenPairService) {}

  execute(dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.tokenPairService.rotate(dto.refreshToken);
  }
}
