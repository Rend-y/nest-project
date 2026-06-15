import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TAuthenticatedRequest } from '../types/t-authenticated-request';

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<TAuthenticatedRequest>();

    return request.user.sub;
  },
);
